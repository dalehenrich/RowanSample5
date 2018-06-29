
run
	| projectName projectDefinition packageNames utils dirPath |
	projectName := 'RowanSample5'.
	packageNames := { 'RowanSample5-GlobalsExtensions' }.
	#('Red' 'Yellow' 'Blue' 'Dark')
	do: [:user |
		packageNames 
			add: 'RowanSample5-', user, '-Core' ].
	projectDefinition := Rowan projectTools create
		createProjectDefinitionFromSpecUrl: RowanSample5_Spec_Url.
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
		| packageName packageDefinition |
		packageName := 'RowanSample5-', user, '-Core'.
		packageDefinition := projectDefinition packageNamed: packageName.
		1 to: 2 do: [:index |
			| classDefinition   extensionPackageName className classExtensionDefinition methodSelector |
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
			methodSelector := user asLowercase, index asString.
			classDefinition
				addInstanceMethodDefinition:
					(RwMethodDefinition
						newForSelector: methodSelector asSymbol
						protocol: 'accessing'
						source: methodSelector, ' ^1').
			packageDefinition addClassDefinition: classDefinition. 
			classExtensionDefinition := RwClassExtensionDefinition newForClassNamed: className.
			#('Red' 'Yellow' 'Blue' 'Dark')
				do: [:extensionUser |
					extensionUser ~= user
						ifTrue: [ 
							| extensionPackageDefinition extensionPackageName |
							extensionPackageName := 'RowanSample5-', extensionUser, '-Core'.
							extensionPackageDefinition := projectDefinition packageNamed: extensionPackageName.
							methodSelector :=  'ext', extensionUser, index printString.
							classExtensionDefinition
								addInstanceMethodDefinition:
									(RwMethodDefinition
										newForSelector: methodSelector asSymbol
										protocol: '*', extensionPackageName asLowercase
										source: methodSelector, ' ^2').
							extensionPackageDefinition addClassExtension: classExtensionDefinition ] ] ] ].
	#('Red' 'Yellow' 'Blue' 'Dark')
	do: [:user |
		| globalsExtensionsPackageName className packageDefinition classExtensionDefinition methodSelector  |
		globalsExtensionsPackageName := 'RowanSample5-GlobalsExtensions'.
		className := 'Object'.
		packageDefinition := projectDefinition packageNamed: globalsExtensionsPackageName.
		classExtensionDefinition := packageDefinition classExtensions 
			at: className
			ifAbsentPut: [ RwClassExtensionDefinition newForClassNamed: className ].
		methodSelector :=  'ext', user.
		classExtensionDefinition
			addInstanceMethodDefinition:
				(RwMethodDefinition
					newForSelector: methodSelector asSymbol
					protocol: '*', globalsExtensionsPackageName asLowercase
					source: methodSelector, ' ^3') ].

	"write"
	Rowan projectTools write writeProjectDefinition: projectDefinition.

%
commit