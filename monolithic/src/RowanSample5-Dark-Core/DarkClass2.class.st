Class {
	#name : 'DarkClass2',
	#superclass : 'Object',
	#instVars : [
		'ivar1'
	],
	#gs_constraints : [
		[
			'ivar1',
			'DarkSubclass2'
		]
	],
	#category : 'RowanSample5-Dark-Core'
}

{ #category : 'accessing' }
DarkClass2 >> dark2 [ ^1
]
