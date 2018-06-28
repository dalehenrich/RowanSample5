
run
	| projectName projectDefinition packageNames utils dirPath |
	projectName := 'RowanSample5'.
	packageNames := {}.
	1 to: 2 do: [:index |
		#('Red' 'Yellow' 'Blue' 'Dark')
		do: [:user |
			packageNames 
				add: 'RowanSample5-', user, index  printString, '-Core';
				add: 'RowanSample5-', user, index printString, '-Extensions' ] ].
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
	1 to: 2 do: [:index |
		#('Red' 'Yellow' 'Blue' 'Dark')
		do: [:user |
			| classDefinition packageName packageDefinition extensionPackageName className classExtensionDefinition |
			packageName := 'RowanSample5-', user, index printString, '-Core'.
			className := user, 'Class', index printString.
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
						source: 'method1 ^1'"'method', index asString, ' ^1'").

			packageDefinition := projectDefinition packageNamed: packageName.
			packageDefinition addClassDefinition: classDefinition. 

			user ~= 'Dark'
				ifTrue: [
					"No external extension methods for Dark, since no write permissions"
					extensionPackageName := 'RowanSample5-', user, index printString, '-Extensions'.
					classExtensionDefinition := RwClassExtensionDefinition newForClassNamed: className.
					#('Red' 'Yellow' 'Blue' 'Dark')
						do: [:extensionUser |
							extensionUser ~= user
								ifTrue: [ 
									| methodSelector |
									methodSelector :=  ('ext', extensionUser, index printString) asSymbol.
									classExtensionDefinition
										addInstanceMethodDefinition:
											(RwMethodDefinition
												newForSelector: methodSelector
												protocol: '*', extensionPackageName asLowercase
												source: methodSelector asString, ' ^2') ] ].
					packageDefinition := projectDefinition packageNamed: extensionPackageName.
					packageDefinition addClassExtension: classExtensionDefinition ] ] ].

	"write"
	Rowan projectTools write writeProjectDefinition: projectDefinition.

%
commit
