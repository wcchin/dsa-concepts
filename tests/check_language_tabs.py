"""Execute the published JS/Julia topic downloads against independent fixtures.

Requires Node.js and Julia on PATH (or JULIA=/path/to/julia).
"""
from pathlib import Path
import os
import re
import subprocess
import tempfile
from language_cases import cases

ROOT = Path(__file__).resolve().parents[1]


def main():
    subprocess.run(['python', str(ROOT/'scripts/build_language_examples.py'), '--check'], check=True)
    records = cases()
    topics = {p.stem for p in (ROOT/'examples/languages').glob('*.js')} - {'support'}
    assert set(records) == topics, (topics - set(records), set(records) - topics)
    pages = list((ROOT/'topics').glob('*/*.md'))
    panels = 0
    for page in pages:
        text = page.read_text()
        counts = [len(re.findall(r'^```'+lang+r'\n', text, re.M)) for lang in ('python','javascript','julia')]
        assert len(set(counts)) == 1, (page, counts)
        panels += counts[0]
        for code in re.findall(r'^```python\n(.*?)^```', text, re.S|re.M):
            compile(code, str(page), 'exec')
    print(f'{panels} panels have three languages; Python listings compile', flush=True)
    total = 0
    with tempfile.TemporaryDirectory(prefix='dsa-languages-') as folder:
        for topic, checks in records.items():
            for i, (ext, runtime) in enumerate([('js','node'),('jl',os.environ.get('JULIA','julia'))]):
                if ext == 'js':
                    before = 'let CHECKS=0;function check(ok){CHECKS++;if(!ok)throw new Error("check "+CHECKS+" failed");}\nfunction rejects(f){let raised=false;try{f()}catch(e){raised=true;}check(raised);}\nconsole.assert=(ok,...msg)=>{if(!ok)throw new Error(msg.join(" "));};\n'
                    after = '\n(()=>{'+checks[i]+'\n})();\nconsole.log("DSA_CHECKS="+CHECKS);\n'
                else:
                    before = '''const CHECKS=Ref(0)
function check(ok)
 CHECKS[]+=1
 ok || error("check $(CHECKS[]) failed")
end
function rejects(f)
 raised=false
 try;f();catch;raised=true;end
 check(raised)
end
struct TestRecord
 key::Int
 tag::Int
end
Base.:(<=)(a::TestRecord,b::TestRecord)=a.key<=b.key
Base.:(>)(a::TestRecord,b::TestRecord)=a.key>b.key
'''
                    after = '\nfunction run_checks()\n'+checks[i]+'\nend\nrun_checks()\nprintln("DSA_CHECKS=",CHECKS[])\n'
                path = Path(folder)/f'{topic}.{ext}'
                path.write_text(before+(ROOT/f'examples/languages/{topic}.{ext}').read_text()+after)
                result = subprocess.run([runtime,str(path)],capture_output=True,text=True,timeout=120)
                if result.returncode:
                    raise SystemExit(f'{topic} / {ext} failed:\n{result.stdout}\n{result.stderr}')
                count = int(re.search(r'DSA_CHECKS=(\d+)',result.stdout).group(1))
                total += count
                print(f'{topic} / {ext}: {count} checks passed',flush=True)
    print(f'{total} behavioural checks passed across {2*len(records)} topic programs')


if __name__ == '__main__':
    main()
