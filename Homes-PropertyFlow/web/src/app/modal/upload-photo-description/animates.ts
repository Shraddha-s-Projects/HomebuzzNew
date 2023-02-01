import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'max-height': '10020px', 'opacity': '1', 'visibility': 'visible'
        })),
        state('out', style({
            'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('500ms ease-in-out', style({
                'opacity': '0',
                'visibility': 'hidden'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('0ms ease-in-out', style({
                'visibility': 'hidden'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '10020px'
            })),
            animate('1ms ease-in-out', style({
                'opacity': '0'
            }))
        ]
        )])
    ]),
]
