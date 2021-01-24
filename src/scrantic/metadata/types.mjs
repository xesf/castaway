/** Scene Execution Flag Types */
export const FlagType = {
    NONE: 0x00,
    STORY_SCENE: 0x01,
    SPECIAL_SCENE: 0x02,
    LOW_TIDE: 0x04,
    LEFT_ISLAND: 0x08,
    NO_SEQUENCE: 0x10,
    NO_ISLAND: 0x20,
    NO_RAFT: 0x40
};

/** Island Location Points */
export const PointType = {
    A: 0,
    B: 1, 
    C: 2,
    D: 3,
    E: 4, 
    F: 5,
};

/** Island Location Heading Towards */
export const HeadingType = {
    S:  0, // South
    SW: 1, // South-West
    W:  2, // West
    NW: 3, // North-West
    N:  4, // North
    NE: 5, // North-East
    E:  6, // East
    SE: 7, // South-East
};
