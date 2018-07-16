Class {
	#name : 'BlueClass1',
	#superclass : 'Object',
	#instVars : [
		'ivar1'
	],
	#gs_constraints : [
		[
			'ivar1',
			'BlueSubclass1'
		]
	],
	#category : 'RowanSample5-Blue-Core'
}

{ #category : 'accessing' }
BlueClass1 >> blue1 [ ^1
]
