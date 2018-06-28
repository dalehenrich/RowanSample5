
run
	| projectName projectDefinition packageNames |
	projectName := 'RowanSample5'.
	packageNames := { 'RowanSample5-Red-Core' . 'RowanSample5-Blue-Core' .'RowanSample5-Yellow-Core' .'RowanSample5-Dark-Core' }.
	projectDefinition := Rowan projectTools create
		createGitBasedProject: projectName
		packageNames: packageNames
		format: 'tonel'
		root: '$ROWAN_PROJECTS_HOME/RowanSample5'.
	#('Red' 'Yellow' 'Blue' 'Dark')
		do: [:user |
			| classDefinition packageName packageDefinition |
			packageName := 'RowanSample5-', user, '-Core'.
			classDefinition := RwClassDefinition
				newForClassNamed: user, 'Class'
				super: 'Object'
				instvars: #()
				classinstvars: #()
				classvars: #()
				category: packageName
				comment: ''
				pools: #()
				type: 'normal'.
			classDefinition
				addInstanceMethodDefinition:
					(RwMethodDefinition
						newForSelector: #'method1'
						protocol: 'accessing'
						source: 'method1 ^1').

			packageDefinition := projectDefinition packageNamed: packageName.
			packageDefinition addClassDefinition: classDefinition ].
	"write"
	Rowan projectTools write writeProjectDefinition: projectDefinition.

%
commit
