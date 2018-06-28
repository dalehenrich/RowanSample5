
run
	| projectName projectDefinition packageNames utils dirPath |
	projectName := 'RowanSample5'.
	packageNames := { 'RowanSample5-Red1-Core' . 'RowanSample5-Blue1-Core' .'RowanSample5-Yellow1-Core' .'RowanSample5-Dark1-Core' .
			 'RowanSample5-Red1-Extensions' . 'RowanSample5-Blue1-Extensions' .'RowanSample5-Yellow1-Extensions' .
			'RowanSample5-Dark1-Extensions' }.
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
			| classDefinition packageName packageDefinition extensionPackageName className classExtensionDefinition |
			packageName := 'RowanSample5-', user, '1-Core'.
			className := user, 'Class'.
			classDefinition := RwClassDefinition
				newForClassNamed: className
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
			packageDefinition addClassDefinition: classDefinition. 

			user ~= 'Dark'
				ifTrue: [
					"No external extension methods for Dark, since no write permissions"
					extensionPackageName := 'RowanSample5-', user, '1-Extensions'.
					classExtensionDefinition := RwClassExtensionDefinition newForClassNamed: className.
					#('Red' 'Yellow' 'Blue' 'Dark')
						do: [:extensionUser |
							extensionUser ~= user
								ifTrue: [ 
									| methodSelector |
									methodSelector :=  ('ext', extensionUser, '1') asSymbol.
									classExtensionDefinition
										addInstanceMethodDefinition:
											(RwMethodDefinition
												newForSelector: methodSelector
												protocol: '*', extensionPackageName asLowercase
												source: methodSelector asString, ' ^2') ] ].
					packageDefinition := projectDefinition packageNamed: extensionPackageName.
					packageDefinition addClassExtension: classExtensionDefinition ] ].

	"write"
	Rowan projectTools write writeProjectDefinition: projectDefinition.

%
commit
