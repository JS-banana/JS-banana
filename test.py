import os
import pathlib

root = pathlib.Path(__file__).parent.resolve()

readme = root / "packages/wakatime/time.txt"

readme_contents = readme.open(encoding='UTF-8').read()

print(readme_contents)
