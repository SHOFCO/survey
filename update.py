#!/usr/bin/python

import json
import yaml


SCHEMA = {
    '*': {
        'required': {'label', 'type'},
        'allowed': {'instructions', 'subs', 'when', 'endSurveyWhen', 'referenceAs'}
    },
    'yesNo': {
    },
    'text': {
        'allowed': {'rows'}
    },
    'signature': {},
    'checkboxes': {
        'required': {'options'},
        'allowed': {'other', 'noneOfTheAbove'}
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
        'required': {'keys', 'keyLabel', 'valueLabel'},
        'allowed': {'valueType'}
    }
}

def validateQuestion(question):
    errors = 0
    fieldType = question.get('type')
    label = question.get('label', 'UNLABELED QUESTION')
    if not fieldType:
        print 'Question "%s" has no type' % label
        errors += 1
        
    elif fieldType not in SCHEMA:
        print 'Question "%s" has illegal type' % (label, fieldType)
        errors += 1
        
    else:
        fields = set(question.keys())
        required = SCHEMA['*']['required'] | SCHEMA[fieldType].get('required', set())
        allowed = SCHEMA['*']['allowed'] | SCHEMA[fieldType].get('allowed', set())
        
        if required - fields:
            print 'Question "%s" of type %s is missing fields: %s' % (label, fieldType, required - fields)
        extra = fields - (required | allowed)
        if extra:
            print 'Question "%s" of type %s has extra fields: %s' % (label, fieldType, extra)
        
    if 'subs' in question:
        for sub in question['subs']:
            errors == validateQuestion(sub)

    return errors

    
def main():
    try:
        s = open('baseline-2016.yaml').read().replace('-\t', '-   ').replace('\t', '    ')
        raw = yaml.load(s)
    except yaml.YAMLError as exc:
        print 'Could not load file'
        print exc.problem_mark
        return
    
    errors = 0
    for page in raw:
        if 'questions' in page:
            for question in page['questions']:
                errors += validateQuestion(question)
            
    # TODO: compilation / validation
    #    - no overlapping keys
    #    - check for raw true or false in options lists
    #           - this happens when Yes or No is an option instead of "Yes" or "No"

    if errors:
        print '%d Errors!' % errors
    else:
        json.dump(raw, open('viewer/baseline-2016.json', 'w'))
        print 'Success!'
    
    

if __name__ == '__main__':
    main()
