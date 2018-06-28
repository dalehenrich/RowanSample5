
run
	| projectName projectDefinition packageNames utils dirPath |
	projectName := 'RowanSample5'.
	packageNames := { 'RowanSample5-Red-Core' . 'RowanSample5-Blue-Core' .'RowanSample5-Yellow-Core' .'RowanSample5-Dark-Core' }.
	projectDefinition := Rowan projectTools create
		createProjectDefinitionFromSpecUrl: 'file:$ROWAN_PROJECTS_HOME/RowanSample5/rowan/specs/RowanSample5_application.ston'.
	utils := Rowan fileUtilities.
	dirPath := projectDefinition repositoryRootPath , utils pathNameDelimiter , projectDefinition repoPath.
	utils ensureDirectoryExists: dirPath.
	utils
		writeStreamFor: 'properties.st'
		in: dirPath
		do: [ :fileStream | fileStream nextPutAll: '{ #format : ''tonel''}' ].	
	projectDefinition addPackagesNamed: packageNames.
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
