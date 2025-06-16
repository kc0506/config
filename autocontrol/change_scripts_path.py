import json
from pathlib import Path
from typing import Any

scripts_folder = Path(__file__).parent / "scripts"
input_settings_file = Path(__file__).parent / "settings_template.acs"
output_settings_file = Path(__file__).parent / "settings.acs"


def traverse(data: Any):
    if isinstance(data, dict):
        for key, value in data.items():
            if key == "srcFile":
                old_path = Path(value)
                new_path = scripts_folder / old_path.name
                data[key] = str(new_path)
            else:
                traverse(value)
    elif isinstance(data, list):
        for item in data:
            traverse(item)


with open(input_settings_file, "r") as f:
    settings = json.load(f)

traverse(settings)

with open(output_settings_file, "w") as f:
    json.dump(settings, f)
