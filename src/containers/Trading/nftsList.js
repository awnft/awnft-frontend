
import StandardShovel from '../../images/StandardShovel.png';
import StandardDrill from '../../images/StandardDrill.png';
// import StandardCapacitor from '../../images/StandardCapacitor.png';
// import RD9000Excavator from '../../images/RD9000Excavator.png';
// import QuarkSeparator from '../../images/QuarkSeparator.png';
import ProcessingRing from '../../images/ProcessingRing.png';
import PowerExtractor from '../../images/PowerExtractor.png';
// import LargeExplosive from '../../images/LargeExplosive.png';
// import LargeCapacitor from '../../images/LargeCapacitor.png';
import InfusedExtractor from '../../images/InfusedExtractor.png';
import GlavorDisc from '../../images/GlavorDisc.png';
import GasriggedExtractor from '../../images/GasriggedExtractor.png';
import DraxosAxe from '../../images/DraxosAxe.png';
import PowerSaw from '../../images/PowerSaw.png';
// import CausianAttractor from '../../images/CausianAttractor.png';
// import BasicTriliumDetector from '../../images/BasicTriliumDetector.png';
// import BarrelDigger from '../../images/BarrelDigger.png';
// import ArtunianShovel from '../../images/ArtunianShovel.png';

const list = [
	{
		name: 'Standard Shovel',
		symbol: 'Shov',
		image: StandardShovel,
		template_id: 19552,
		scope: 0,
		attributes: [
			{
				key: 'Rarity',
				value: 'Abundant',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Extractor',
			},
			{
				key: 'Delay',
				value: '80',
			},
			{
				key: 'Difficulty',
				value: '0'
			},
			{
				key: 'ease',
				value: '10'
			},
			{
				key: 'luck',
				value: '5'
			},
		]
	},
	{
		name: 'Standard Drill',
		symbol: 'Drill',
		image: StandardDrill,
		template_id: 19553,
		scope: 1,
		attributes: [
			{
				key: 'Rarity',
				value: 'Abundant',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Extractor',
			},
			{
				key: 'Delay',
				value: '120',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'ease',
				value: '20'
			},
			{
				key: 'luck',
				value: '7'
			},
		]
	},
	// {
	// 	name: 'Standard Capacitor',
	// 	symbol: 'StandardCapacitor',
	// 	image: StandardCapacitor,
	// 	template_id: 19558,
	// },
	// {
	// 	name: 'RD9000 Excavator',
	// 	symbol: 'RD9000Excavator',
	// 	image: RD9000Excavator,
	// 	template_id: 19572,
	// },
	// {
	// 	name: 'Quark Separator',
	// 	symbol: 'QuarkSeparator',
	// 	image: QuarkSeparator,
	// 	template_id: 19570,
	// },
	{
		name: 'Processing Ring',
		symbol: 'Ring',
		image: ProcessingRing,
		template_id: 19564,
		scope: 7,
		attributes: [
			{
				key: 'Rarity',
				value: 'Rare',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Manipulator',
			},
			{
				key: 'Delay',
				value: '600',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'ease',
				value: '10'
			},
			{
				key: 'luck',
				value: '80'
			},
		]
	},
	{
		name: 'Power Extractor',
		symbol: 'Power',
		image: PowerExtractor,
		template_id: 19554,
		scope: 8,
		attributes: [
			{
				key: 'Rarity',
				value: 'Common',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Extractor',
			},
			{
				key: 'Delay',
				value: '270',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'ease',
				value: '50'
			},
			{
				key: 'luck',
				value: '10'
			},
		]
	},
	// {
	// 	name: 'Large Explosive',
	// 	symbol: 'LargeExplosive',
	// 	image: LargeExplosive,
	// 	template_id: 19567,
	// },
	// {
	// 	name: 'Large Capacitor',
	// 	symbol: 'LargeCapacitor',
	// 	image: LargeCapacitor,
	// 	template_id: 19563,
	// },
	{
		name: 'Infused Extractor',
		symbol: 'Infus',
		image: InfusedExtractor,
		template_id: 19556,
		scope: 3,
		attributes: [
			{
				key: 'Rarity',
				value: 'Common',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Extractor',
			},
			{
				key: 'Delay',
				value: '360',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'ease',
				value: '80'
			},
			{
				key: 'luck',
				value: '0'
			},
		]
	},
	{
		name: 'Glavor Disc',
		symbol: 'Glav',
		image: GlavorDisc,
		template_id: 19565,
		scope: 4,
		attributes: [
			{
				key: 'Rarity',
				value: 'Rare',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Manipulator',
			},
			{
				key: 'Delay',
				value: '300',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'Ease',
				value: '10'
			},
			{
				key: 'Luck',
				value: '40'
			},
		]
	},
	{
		name: 'Gasrigged Extractor',
		symbol: 'Gas',
		image: GasriggedExtractor,
		template_id: 19555,
		scope: 2,
		attributes: [
			{
				key: 'Rarity',
				value: 'Common',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Extractor',
			},
			{
				key: 'Delay',
				value: '540',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'Ease',
				value: '90'
			},
			{
				key: 'Luck',
				value: '20'
			},
		]
	},
	{
		name: 'Draxos Axe',
		symbol: 'Drax',
		image: DraxosAxe,
		template_id: 19562,
		scope: 5,
		attributes: [
			{
				key: 'Rarity',
				value: 'Rare',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'ExoTool',
			},
			{
				key: 'Delay',
				value: '420',
			},
			{
				key: 'Difficulty',
				value: '3'
			},
			{
				key: 'Ease',
				value: '10'
			},
			{
				key: 'Luck',
				value: '60'
			},
		]
	},
	{
		name: 'Power Saw',
		symbol: 'Saw',
		image: PowerSaw,
		template_id: 19561,
		scope: 6,
		attributes: [
			{
				key: 'Rarity',
				value: 'Common',
			},
			{
				key: 'Shine',
				value: 'Stone',
			},
			{
				key: 'Type',
				value: 'Manipulator',
			},
			{
				key: 'Delay',
				value: '360',
			},
			{
				key: 'Difficulty',
				value: '1'
			},
			{
				key: 'Ease',
				value: '60'
			},
			{
				key: 'Luck',
				value: '20'
			},
		]
	},
	// {
	// 	name: 'Causian Attractor',
	// 	symbol: 'CausianAttractor',
	// 	image: CausianAttractor,
	// 	template_id: 19569,
	// },
	// {
	// 	name: 'Basic Trilium Detector',
	// 	symbol: 'BasicTriliumDetector',
	// 	image: BasicTriliumDetector,
	// 	template_id: 19559,
	// },
	// {
	// 	name: 'Barrel Digger',
	// 	symbol: 'BarrelDigger',
	// 	image: BarrelDigger,
	// 	template_id: 19568,
	// },
	// {
	// 	name: 'Artunian Shovel',
	// 	symbol: 'ArtunianShovel',
	// 	image: ArtunianShovel,
	// 	template_id: 19566,
	// },
];

export default list;