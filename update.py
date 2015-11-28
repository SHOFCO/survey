#!/usr/bin/python

import json
import yaml

def main():
    try:
        s = open('baseline-2016.yaml').read().replace('-\t', '-   ').replace('\t', '    ')
        raw = yaml.load(s)
    except yaml.YAMLError as exc:
        print 'Could not load file'
        print exc.problem_mark
        return
    
    # TODO: compilation / validation
    #    - field types (present and valid)
    #    - no overlapping keys
    #    - correct sub-fields present (schema validation)
    
    json.dump(raw, open('viewer/baseline-2016.json', 'w'))
    print 'Success!'
    
    

if __name__ == '__main__':
    main()
