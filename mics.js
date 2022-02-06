const mics = {
    //  "C414 XLII": {
    //     "manufacturer": "AKG",
    //     "polar": ["Cardioid", "Figure-8", "Omni", "Hemi"],
    //     "highestFreq": 20,
    //     "lowestFreq": 20,
    //     "SPL": 158,
    //     "hasPad": true,
    //     "type": "LDC",
    //     "lendingLevel": 4,
    //     "uses": [
    //         "Acoustic Guitar",
    //         "Electric Guitar",
    //         "Electric Bass",
    //         "Vocals",
    //         "Acoustic Piano",
    //         "Violin/Viola/Cello",
    //         "Trumpet/Sax/Horns",
    //         "Drum Overheads",
    //         "Snare Drum",
    //         "Toms",
    //         "Hats/Cymbal Close Mics",
    //         "Kick",
    //         "Drum Room",
    //         "General Purpose"
    //     ],
    //     "char": [
    //         "Bright",
    //         "Transparent",
    //         "Dark",
    //         "Saturated",
    //         "Neutral",
    //         "Punchy",
    //         "Smooth",
    //     ]
    // },
    "R44CE": {
        "manufacturer": "AEA",
        "polar": ["Figure-8"],
        "highestFreq": 20,
        "lowestFreq": 30,
        "SPL": 140,
        "hasPad": false,
        "type": "Ribbon",
        "lendingLevel": 4,
        "uses": [
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room"
        ],
        "char": [
            "Dark",
            "Saturated",
            "Smooth",
        ]
    },
    "R84": {
        "manufacturer": "AEA",
        "polar": ["Figure-8"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 165,
        "hasPad": false,
        "type": "Ribbon",
        "lendingLevel": 4,
        "uses": [
            "Electric Guitar",
            "Electric Bass",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Dark",
            "Saturated",
            "Smooth",
        ]
    },
    "C 451 B": {
        "manufacturer": "AKG",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 155,
        "hasPad": true,
        "type": "SDC",
        "lendingLevel": 3,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Drum Overheads",
            "Snare Drum",
            "Hats/Cymbal Close Mics",
        ],
        "char": [
            "Bright",
            "Transparent",
        ]
    },
    "C414 XLII": {
        "manufacturer": "AKG",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 158,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Hats/Cymbal Close Mics",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Bright",
            "Transparent",
        ]
    },
    "C414 XLS": {
        "manufacturer": "AKG",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 158,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 3,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Hats/Cymbal Close Mics",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Bright",
            "Transparent",
        ]
    },
    "D112 MKII": {
        "manufacturer": "AKG",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 17,
        "SPL": 160,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 1,
        "uses": [
            "Electric Bass",
            "Kick",
        ],
        "char": [
            "Dark",
            "Smooth",
        ]
    },
    "4006A": {
        "manufacturer": "DPA",
        "polar": ["Omni"],
        "highestFreq": 20,
        "lowestFreq": 10,
        "SPL": 139,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "4011A": {
        "manufacturer": "DPA",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 40,
        "SPL": 139,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": "Request",
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "4099 Extreme SPL": {
        "manufacturer": "DPA",
        "polar": ["Cardioid"],
        "highestFreq": 15,
        "lowestFreq": 80,
        "SPL": 137,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Trumpet/Sax/Horns",
            "Snare Drum",
            "Toms",
            "Hats/Cymbal Close Mics",
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "4099 Loud SPL": {
        "manufacturer": "DPA",
        "polar": ["Cardioid"],
        "highestFreq": 15,
        "lowestFreq": 9,
        "SPL": 131,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Toms",
            "Hats/Cymbal Close Mics",
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "TC30K": {
        "manufacturer": "Earthworks",
        "polar": ["Omni"],
        "highestFreq": 30,
        "lowestFreq": 9,
        "SPL": 150,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "RE20": {
        "manufacturer": "Electro-Voice",
        "polar": ["Cardioid"],
        "highestFreq": 18,
        "lowestFreq": 45,
        "SPL": 141,
        "hasPad": true,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Electric Guitar",
            "Electric Bass",
            "Vocals",
            "Snare Drum",
            "Hats/Cymbal Close Mics",
            "Kick",
        ],
        "char": [
            "Dark",
            "Punchy",
        ]
    },
    "MA-201 FET": {
        "manufacturer": "Mojave",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 125,
        "hasPad": false,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Neutral",
            "Smooth",
        ]
    },
    "KM130": {
        "manufacturer": "Neumann",
        "polar": ["Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 140,
        "hasPad": true,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Saturated",
            "Neutral",
            "Smooth",
        ]
    },
    "KM143": {
        "manufacturer": "Neumann",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 138,
        "hasPad": true,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Hats/Cymbal Close Mics",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Saturated",
            "Neutral",
            "Smooth",
        ]
    },
    "KM184": {
        "manufacturer": "Neumann",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 138,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 3,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Hats/Cymbal Close Mics",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Dark",
            "Saturated",
            "Smooth",
        ]
    },
    "M149 Tube": {
        "manufacturer": "Neumann",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 136,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Bass",
            "Vocals",
        ],
        "char": [
            "Saturated",
            "Neutral",
            "Smooth",
        ]
    },
    "TLM49": {
        "manufacturer": "Neumann",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 110,
        "hasPad": false,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello"
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "U47 FET": {
        "manufacturer": "Neumann",
        "polar": ["Cardioid"],
        "highestFreq": 16,
        "lowestFreq": 40,
        "SPL": 137,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Vocals",
            "Kick",
        ],
        "char": [
            "Bright",
            "Saturated",
            "Smooth",
        ]
    },
    "U87 Ai": {
        "manufacturer": "Neumann",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 127,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": "Request",
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Bright",
            "Neutral",
        ]
    },
    "NT5": {
        "manufacturer": "Rode",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 143,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 2,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Neutral",
        ]
    },
    "R10": {
        "manufacturer": "Royer",
        "polar": ["Figure-8"],
        "highestFreq": 15,
        "lowestFreq": 30,
        "SPL": 160,
        "hasPad": false,
        "type": "Ribbon",
        "lendingLevel": 3,
        "uses": [
            "Electric Guitar",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
        ],
        "char": [
            "Dark",
            "Saturated",
            "Smooth",
        ]
    },
    "R121": {
        "manufacturer": "Royer",
        "polar": ["Cardioid", "Figure-8", "Omni", "Hemi"],
        "highestFreq": 15,
        "lowestFreq": 30,
        "SPL": 135,
        "hasPad": false,
        "type": "Ribbon",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Room",
        ],
        "char": [
            "Saturated",
            "Neutral",
            "Smooth",
        ]
    },
    "CMC 6 MK4": {
        "manufacturer": "Schoeps",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 131,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": "Request",
        "uses": [
            "Acoustic Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "e604": {
        "manufacturer": "Sennheiser",
        "polar": ["Cardioid"],
        "highestFreq": 18,
        "lowestFreq": 40,
        "SPL":160,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Snare Drum",
            "Toms",
        ],
        "char": [
            "Dark",
        ]
    },
    "e901": {
        "manufacturer": "Sennheiser",
        "polar": ["Hemi"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 154,
        "hasPad": false,
        "type": "Boundary Condenser",
        "lendingLevel": 3,
        "uses": [
            "Kick",
        ],
        "char": [
            "Punchy",
        ]
    },
    "MD 421 II": {
        "manufacturer": "Sennheiser",
        "polar": ["Cardioid"],
        "highestFreq": 17,
        "lowestFreq": 30,
        "SPL": 160,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 2,
        "uses": [
            "Electric Guitar",
            "Electric Bass",
            "Vocals",
            "Trumpet/Sax/Horns",
            "Snare Drum",
            "Toms",
            "Hats/Cymbal Close Mics",
            "Kick",
            "General Purpose"
        ],
        "char": [
            "Dark",
            "Punchy",
        ]
    },
    "Beta 52A": {
        "manufacturer": "Shure",
        "polar": ["Cardioid"],
        "highestFreq": 10,
        "lowestFreq": 20,
        "SPL": 174,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 1,
        "uses": [
            "Electric Bass",
            "Kick",
        ],
        "char": [
            "Neutral",
            "Punchy",
        ]
    },
    "Beta 56A": {
        "manufacturer": "Shure",
        "polar": ["Cardioid"],
        "highestFreq": 16,
        "lowestFreq": 50,
        "SPL": 200,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Electric Guitar",
            "Snare Drum",
            "Toms",
        ],
        "char": [
        ]
    },
    "SM7B": {
        "manufacturer": "Shure",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 50,
        "SPL": 180,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Electric Guitar",
            "Vocals",
            "Snare Drum",
            "Toms",
            "Hats/Cymbal Close Mics",
            "Kick",
            "General Purpose"
        ],
        "char": [
            "Neutral",
        ]
    },
    "SM57": {
        "manufacturer": "Shure",
        "polar": ["Cardioid"],
        "highestFreq": 15,
        "lowestFreq": 40,
        "SPL": 200,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 1,
        "uses": [
            "Electric Guitar",
            "Trumpet/Sax/Horns",
            "Snare Drum",
            "Toms",
            "Hats/Cymbal Close Mics",
            "General Purpose"
        ],
        "char": [
            "Dark",
            "Neutral",
        ]
    },
    "SM58": {
        "manufacturer": "Shure",
        "polar": ["Cardioid"],
        "highestFreq": 15,
        "lowestFreq": 50,
        "SPL": 200,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 1,
        "uses": [
            "Electric Guitar",
            "Vocals",
            "Trumpet/Sax/Horns",
            "Snare Drum",
            "Toms",
            "Hats/Cymbal Close Mics",
            "General Purpose"
        ],
        "char": [
            "Dark",
            "Neutral",
        ]
    },
    "Super 55": {
        "manufacturer": "Shure",
        "polar": ["Cardioid"],
        "highestFreq": 17,
        "lowestFreq": 60,
        "SPL": 200,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Vocals",
        ],
        "char": [
            "Dark",
            "Neutral",
        ]
    },
    "ELA M 260": {
        "manufacturer": "Telefunken",
        "polar": ["Cardioid", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 120,
        "hasPad": false,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
        ],
        "char": [
            "Saturated",
            "Neutral",
            "Smooth",
        ]
    },
    "M80 SH": {
        "manufacturer": "Telefunken",
        "polar": ["Cardioid"],
        "highestFreq": 18,
        "lowestFreq": 50,
        "SPL": 135,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Snare Drum",
        ],
        "char": [
            "Neutral",
            "Punchy",
        ]
    },
    "M81 SH": {
        "manufacturer": "Telefunken",
        "polar": ["Cardioid"],
        "highestFreq": 18,
        "lowestFreq": 50,
        "SPL": 135,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Toms",
        ],
        "char": [
            "Neutral",
            "Punchy",
        ]
    },
    "M82": {
        "manufacturer": "Telefunken",
        "polar": ["Cardioid"],
        "highestFreq": 18,
        "lowestFreq": 25,
        "SPL": 146,
        "hasPad": false,
        "type": "Dynamic",
        "lendingLevel": 3,
        "uses": [
            "Electric Bass",
            "Kick",
        ],
        "char": [
        ]
    },
    "WA-47": {
        "manufacturer": "Warm Audio",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 140,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Electric Bass",
            "Vocals",
            "Trumpet/Sax/Horns",
            "Kick",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Bright",
            "Saturated",
            "Smooth",
        ]
    },
    "WA-84": {
        "manufacturer": "Warm Audio",
        "polar": ["Cardioid", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 133,
        "hasPad": true,
        "type": "SDC",
        "lendingLevel": 3,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Hats/Cymbal Close Mics",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Dark",
            "Saturated",
            "Smooth",
        ]
    },
    "WA-87": {
        "manufacturer": "Warm Audio",
        "polar": ["Cardioid", "Figure-8", "Omni", "Hemi"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 125,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 2,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Electric Bass",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Transparent",
            "Neutral",
        ]
    },
    "KSM44": {
        "manufacturer": "Shure",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 156,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": "Not at SMC",
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Electric Bass",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Toms",
            "Hats/Cymbal Close Mics",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Transparent",
            "Punchy",
            "Smooth",
        ]
    },
    "Origin": {
        "manufacturer": "Aston",
        "polar": ["Cardioid"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 137,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": "Not at SMC",
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Kick",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Bright",
            "Saturated",
            "Smooth",
        ]
    },
    "BV12": {
        "manufacturer": "Avantone",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 146,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Vocals",
            "Acoustic Piano",
            "Violin/Viola/Cello",
            "Trumpet/Sax/Horns",
            "Drum Overheads",
            "Drum Room",
            "General Purpose"
        ],
        "char": [
            "Bright",
            "Saturated",
            "Smooth",
        ]
    },
}