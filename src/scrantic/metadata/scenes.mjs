import { FlagType, PointType, HeadingType } from './types.mjs';

const defaultScene = {
	scene: '',
	storyDay: 0,
	tag: 0,
	description: '',
	startPoint: PointType.A,
	startHeading: HeadingType.S,
	endPoint: PointType.A,
	endHeading: HeadingType.S,
	flags: FlagType.NONE
};

// order as per ADS scene tags
export const StoryScenes = [
    // ACTIVITY
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 1,
		description: 'GAG DIVES',
		startPoint: PointType.E,
		startHeading: HeadingType.SE,
		flags: FlagType.SPECIAL_SCENE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 12,
		description: 'GULL 3 STILL READING',
		startPoint: PointType.D,
		startHeading: HeadingType.SW,
		flags: FlagType.SPECIAL_SCENE | FlagType.LOW_TIDE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 11,
		description: 'GULL 2 BATHING',
		flags: FlagType.SPECIAL_SCENE | FlagType.NO_SEQUENCE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 10,
		description: 'GULL 1 READING',
		startPoint: PointType.D,
		startHeading: HeadingType.SW,
		flags: FlagType.SPECIAL_SCENE | FlagType.LOW_TIDE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 4,
		description: 'MUNDANE DIVE',
		startPoint: PointType.E,
		startHeading: HeadingType.SE,
		endPoint: PointType.E,
		endHeading: HeadingType.SE,
		flags: FlagType.LOW_TIDE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 5,
		description: 'NATIVE 1',
		startPoint: PointType.E,
		startHeading: HeadingType.SW,
		flags: FlagType.SPECIAL_SCENE | FlagType.LOW_TIDE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 6,
		description: 'GAG JOHN READ',
		startPoint: PointType.D,
		startHeading: HeadingType.SW,
		flags: FlagType.SPECIAL_SCENE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 7,
		description: 'MUNDANE JOHN READ',
		startPoint: PointType.D,
		startHeading: HeadingType.SW,
		endPoint: PointType.F,
		endHeading: HeadingType.SW,
		flags: FlagType.LOW_TIDE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 8,
		description: 'JOHN BATH',
		endPoint: PointType.D,
		endHeading: HeadingType.SE,
		flags: FlagType.NO_SEQUENCE
	},
	{
		...defaultScene,
		name: 'ACTIVITY.ADS',
		tag: 9,
		description: 'NATIVE 3',
		startPoint: PointType.E,
		startHeading: HeadingType.E,
		flags: FlagType.SPECIAL_SCENE | FlagType.LOW_TIDE
	}
];
