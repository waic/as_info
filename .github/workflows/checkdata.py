# /// script
# dependencies = [
#     "PyYAML",
# ]
# ///
import yaml
import sys


def detect_missing_tech_ids(tests, techs):
    tech_ids_in_tests = set()
    for content in tests.values():
        for tech in content["techs"]:
            tech_ids_in_tests.add(tech)
    tech_ids = set(techs.keys())
    return tech_ids_in_tests - tech_ids


def detect_missing_criterion_ids(tests, criteria):
    criteria_ids_in_tests = set()
    for content in tests.values():
        for criterion in content["criteria"]:
            criteria_ids_in_tests.add(criterion)
    criteria_ids = set(criteria.keys())
    return criteria_ids_in_tests - criteria_ids


def load_yaml(file_path):
    try:
        with open(file_path, "r") as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        sys.exit(1)


if __name__ == "__main__":
    tests = load_yaml("src/content/tests/tests.yaml")
    techs = load_yaml("src/content/techs/techs.yaml")
    criteria = load_yaml("src/content/criteria/criteria.yaml")

    missing_tech_ids = detect_missing_tech_ids(tests, techs)
    if missing_tech_ids:
        print(f"missing {missing_tech_ids}")
        sys.exit(1)

    missing_criterion_ids = detect_missing_criterion_ids(tests, criteria)
    if missing_criterion_ids:
        print(f"missing {missing_criterion_ids}")
        sys.exit(1)

    sys.exit(0)
