"""Execute the binary-search Markdown listings in Python, Node and Julia.

Python 3 standard library only. Node and Julia are required on PATH;
JULIA_BIN may select a Julia executable outside PATH.
"""
from contextlib import redirect_stdout
from io import StringIO
from itertools import combinations_with_replacement
from pathlib import Path
import json
import os
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'topics/searching/binary-search.md'


def main():
    node = shutil.which('node')
    julia = shutil.which(os.environ.get('JULIA_BIN', 'julia'))
    if not node or not julia:
        raise SystemExit('Install Node and Julia; set JULIA_BIN if Julia is outside PATH.')
    blocks = re.findall(r'```(python|javascript|julia)\n(.*?)```', PAGE.read_text(), re.S)
    listings = {lang: [code for name, code in blocks if name == lang]
                for lang in ('python', 'javascript', 'julia')}
    assert all(len(code) == 2 for code in listings.values()), 'Definition and usage required per language'
    for language, extension in [('python', 'py'), ('javascript', 'js'), ('julia', 'jl')]:
        assert (ROOT / f'examples/binary_search.{extension}').read_text() == '\n'.join(listings[language]), 'Download differs from displayed code'
    namespace = {}
    exec(compile(listings['python'][0], str(PAGE), 'exec'), namespace)
    search = namespace['binary_search']
    cases = [(list(a), target)
             for n in range(8)
             for a in combinations_with_replacement(range(-2, 3), n)
             for target in range(-3, 4)]
    cases += [([3, 7, 11, 18, 24], target) for target in (3, 7, 11, 18, 20, 24, 25)]
    safe = 2**53 - 1
    cases += [([-safe, 0, safe], target) for target in (-safe, -safe + 1, 0, safe - 1, safe)]
    cases += [(list(range(0, 4096, 2)), target) for target in (-1, 0, 2048, 2049, 4094, 4095)]
    expected = []
    for values, target in cases:
        original = values.copy()
        result = search(values, target)
        assert values == original, 'Python mutated input'
        # Independent membership/position oracle, including duplicates and absence.
        matches = [i for i, value in enumerate(values) if value == target]
        assert (result is None) == (not matches)
        if result is not None:
            assert type(result) is int and result in matches
        expected.append(-1 if result is None else result)
    # Only the interchange protocol uses -1; public functions retain their own absence values.
    fixtures = ''.join(f'{target}|{",".join(map(str, values))}\n' for values, target in cases)
    js_harness = r'''
const fs = require('node:fs');
for (const line of fs.readFileSync(0, 'utf8').trimEnd().split('\n')) {
    const [targetText, valuesText] = line.split('|');
    const a = valuesText === '' ? [] : valuesText.split(',').map(Number);
    const before = JSON.stringify(a);
    const result = binary_search(a, Number(targetText));
    if (JSON.stringify(a) !== before) throw new Error('JavaScript mutated input');
    if (result !== null && !Number.isInteger(result)) throw new Error('Invalid index type');
    console.log(result === null ? -1 : result);
}
'''
    julia_harness = r'''
for line in eachline(stdin)
    target_text, values_text = split(line, '|'; keepempty=true)
    a = isempty(values_text) ? Int[] : parse.(Int, split(values_text, ','))
    before = copy(a)
    result = binary_search(a, parse(Int, target_text))
    @assert a == before "Julia mutated input"
    @assert result === nothing || result isa Int
    println(result === nothing ? -1 : result - 1)
end
'''
    with tempfile.TemporaryDirectory(prefix='dsa-language-tabs-') as directory:
        folder = Path(directory)
        commands = {
            'JavaScript': ([node], 'javascript', 'js', js_harness),
            'Julia': ([julia, '--startup-file=no', '--history-file=no'], 'julia', 'jl', julia_harness),
        }
        versions = {'Python': subprocess.check_output([os.sys.executable, '--version'], text=True).strip()}
        for label, (command, lang, extension, harness) in commands.items():
            program = folder / f'check.{extension}'
            program.write_text(listings[lang][0] + '\n' + harness)
            completed = subprocess.run(command + [str(program)], input=fixtures, text=True,
                                       capture_output=True, check=True, timeout=90)
            actual = [int(line) for line in completed.stdout.splitlines()]
            assert actual == expected, f'{label} differs after native-index normalisation'
            # Execute the exact displayed usage block, not a duplicate maintained in this test.
            program.write_text('\n'.join(listings[lang]))
            demo = subprocess.check_output(command + [str(program)], text=True, timeout=30)
            wanted = '3\n0\nnull\nnull\n' if lang == 'javascript' else '4\n1\nnothing\nnothing\n'
            assert demo == wanted, (label, demo)
            versions[label] = subprocess.check_output(command[:1] + ['--version'], text=True).strip()
        captured = StringIO()
        with redirect_stdout(captured):
            exec(compile(listings['python'][1], str(PAGE), 'exec'), namespace)
        assert captured.getvalue() == '3\n0\nNone\nNone\n'
    print(json.dumps({'cases_per_language': len(cases), 'languages': 3,
                      'displayed_examples': 'passed', 'input_preservation': 'passed',
                      'versions': versions}, indent=2))


if __name__ == '__main__':
    main()
