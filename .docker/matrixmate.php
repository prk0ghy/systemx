<?php

// this configures the Sorting of Matrix Blocks

return [
    'fields' => [
        'inhaltsbausteine' => [
            'groups' => [[
                'label' => 'Text/Bilder',
                'types' => ['ueberschrift', 'textMitOhneBild', 'galerie', 'tabelle', 'heroimage'],
            ], [
                'label' => 'Hochladen',
                'types' => ['videoDatei', 'audioDatei', 'download'],
            ], [
                'label' => 'Einbetten',
                'types' => ['embeddedVideoAudio', 'h5p'],
            ], [
                'label' => 'Schachteln',
                'types' => ['aufklappkasten', 'aufgabe', 'querslider'],
            ]],
            'hideUngroupedTypes' => true,
        ],
    ],
];
