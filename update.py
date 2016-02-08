#!/usr/bin/python

import json
import sys
import yaml


SCHEMA = {
    '*': {
        'required': {'label', 'type'},
        'allowed': {'instructions', 'subs', 'when', 'endSurveyWhen', 'referenceAs', 'specialSub', 'unskippable'}
    },
    'yesNo': {
    },
    'text': {
        'allowed': {'rows'}
    },
    'signature': {},
    'checkboxes': {
        'required': {'options'},
        'allowed': {'other', 'noneOfTheAbove', 'forceChoice'}
    },
    'random': {
        'required': {'min', 'max'}
    },
    'number': {
        'allowed': {'min', 'max'}
    },
    'options': {
        'required': {'options'},
        'allowed': {'other'}
    },
    'table': {
        'required': {'keys', 'keyLabel'},
        'allowed': {'valueType', 'valueLabel'}
    }
}


def is_latin1(s):
    try:
        s.encode('latin1')
        return True
    except UnicodeEncodeError:
        print 'Label %s uses invalid characters' % s
        return False


def validate_question(question):
    errors = 0
    field_type = question.get('type')
    label = question.get('label', 'UNLABELED QUESTION')
    if not is_latin1(label):
        errors += 1
    if not field_type:
        print 'Question "%s" has no type' % label
        errors += 1
        
    elif field_type not in SCHEMA:
        print 'Question "%s" has illegal type: "%s"' % (label, field_type)
        errors += 1
        
    else:
        fields = set(question.keys())
        required = SCHEMA['*']['required'] | SCHEMA[field_type].get('required', set())
        allowed = SCHEMA['*']['allowed'] | SCHEMA[field_type].get('allowed', set())
        
        if required - fields:
            print 'Question "%s" of type %s is missing fields: %s' % (label, field_type, required - fields)
        extra = fields - (required | allowed)
        if extra:
            print 'Question "%s" of type %s has extra fields: %s' % (label, field_type, extra)
        
    for array_key in ('keys', 'options'):
        if array_key in question:
            for value in question[array_key]:
                if not is_latin1(value):
                    errors += 1

    if 'subs' in question:
        for sub in question['subs']:
            errors == validate_question(sub)

    return errors

    
def main():
    filename = sys.argv[1] if len(sys.argv) > 1 else 'baseline-2016.yaml'
    try:
        s = open(filename).read().replace('-\t', '-   ').replace('\t', '    ')
        raw = yaml.load(s)
    except yaml.YAMLError as exc:
        print 'Could not load file'
        print exc.problem_mark
        return
    
    errors = 0
    for page in raw:
        if 'questions' in page:
            for question in page['questions']:
                errors += validate_question(question)
            
    # TODO: compilation / validation
    #    - no overlapping keys
    #    - check for raw true or false in options lists
    #           - this happens when Yes or No is an option instead of "Yes" or "No"

    if errors:
        print '%d Errors!' % errors
    else:
        with open('www/js/baseline-2016.js', 'w') as f:
            f.write('window.pages = ')
            json.dump(raw, f)
            f.write(';')
        print 'Success!'
    

if __name__ == '__main__':
    main()
