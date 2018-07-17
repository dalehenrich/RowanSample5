Class {
	#name : 'DarkClass1',
	#superclass : 'Object',
	#instVars : [
		'ivar1'
	],
	#gs_constraints : [
		[
			'ivar1',
			'DarkSubclass1'
		]
	],
	#category : 'RowanSample5-Dark1-Core'
}

{ #category : 'accessing' }
DarkClass1 >> dark1 [ ^1
]
