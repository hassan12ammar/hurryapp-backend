# simple python function
import sys, json


def add(a, b):
    return a + b


if __name__ == "__main__":
    a = int(sys.argv[1])
    b = int(sys.argv[2])
    print(json.dumps({"result": add(a, b)}))
