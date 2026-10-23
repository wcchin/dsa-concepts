"""Collect the published JavaScript/Julia listings into runnable topic files.

Markdown is the source of truth. No third-party Python package is required.
Run with --check in CI to reject stale downloads rather than rewriting them.
"""
from pathlib import Path
import argparse
import re

ROOT = Path(__file__).resolve().parents[1]
DEPENDENCIES = {
    'balanced-trees': ['searching'],
    'graph-algorithms': ['graphs', 'union-find'],
    'applications': ['graphs', 'union-find', 'graph-algorithms'],
}


def sources():
    pages = re.findall(r'^\s*-\s+file:\s+(topics/\S+\.md)\s*$', (ROOT/'myst.yml').read_text(), re.M)
    groups = {}
    for page in pages:
        topic = page.split('/')[1]
        groups.setdefault(topic, [])
        blocks = re.findall(r'```(javascript|julia)\n(.*?)```', (ROOT/page).read_text(), re.S)
        for lang, code in blocks:
            groups[topic].append((page, lang, code))
    return groups


def generated():
    groups = sources()
    for topic in groups:
        items = []
        for dep in DEPENDENCIES.get(topic, []):
            items.extend(groups[dep])
        items.extend(groups[topic])
        for lang, ext in [('javascript','js'), ('julia','jl')]:
            prefix = '// ' if lang == 'javascript' else '# '
            support = (ROOT/f'examples/languages/support.{ext}').read_text()
            if lang == 'javascript':
                support = re.sub(r'^module\.exports = .*\n?', '', support, flags=re.M)
            text = prefix+'Generated from the published Markdown; run scripts/build_language_examples.py to refresh.\n'
            text += prefix+'Independent examples may reuse top-level names. Python remains the explanation language.\n\n'+support
            for page, block_lang, code in items:
                if block_lang != lang:
                    continue
                if lang == 'javascript':
                    code = re.sub(r'^(let|const) ', 'var ', code, flags=re.M)
                text += '\n'+prefix+page+'\n'+code.rstrip()+'\n'
            yield ROOT/f'examples/languages/{topic}.{ext}', text


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    paths = list(generated())
    for path, text in paths:
        if args.check:
            if not path.exists() or path.read_text() != text:
                raise SystemExit(f'Stale or missing topic download: {path.relative_to(ROOT)}')
        else:
            path.write_text(text)
    print(f'{len(paths)} topic downloads '+('match their listings' if args.check else 'generated'))


if __name__ == '__main__':
    main()
