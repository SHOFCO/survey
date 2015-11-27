#!/usr/bin/python

import json
import yaml

def main():
    try:
        s = open('baseline-2016.yaml').read().replace('\t', '    ')
        raw = yaml.load(s)
    except yaml.YAMLError as exc:
        print 'Could not load file'
        print exc.problem_mark
        return
    
    # TODO: compilation / validation
    
    json.dump(raw, open('viewer/baseline-2016.json', 'w'))
    
    

if __name__ == '__main__':
    main()
