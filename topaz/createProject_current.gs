
run
	| projectName projectDefinition packageNames utils dirPath |
	projectName := 'RowanSample5'.
	packageNames := { 'RowanSample5-GlobalsExtensions' }.
	1 to: 2 do: [:index |
		#('Red' 'Yellow' 'Blue' 'Dark')
		do: [:user |
			packageNames 
				add: 'RowanSample5-', user, index  printString, '-Core';
				add: 'RowanSample5-', user, index printString, '-Extensions' ] ].
	projectDefinition := Rowan projectTools create
		createProjectDefinitionFromSpecUrl: RowanSample5_Spec_Url.
	utils := Rowan fileUtilities.
	dirPath := projectDefinition repositoryRootPath , utils pathNameDelimiter , 
		projectDefinition repoPath.
	utils ensureDirectoryExists: dirPath.
	utils
		writeStreamFor: 'properties.st'
		in: dirPath
		do: [ :fileStream | fileStream nextPutAll: '{ #format : ''tonel''}' ].	
	projectDefinition addPackagesNamed: packageNames.
	1 to: 2 do: [:index |
		#('Red' 'Yellow' 'Blue' 'Dark')
		do: [:user |
			| classDefinition subclassDefinition packageName packageDefinition 
				extensionPackageName className subclassName classExtensionDefinition 
				methodSelector |
			packageName := 'RowanSample5-', user, index printString, '-Core'.
			className := user, 'Class', index printString.
			subclassName := user, 'Subclass', index printString.
			classDefinition := RwClassDefinition
				newForClassNamed: className
				super: 'Object'
				instvars: #(ivar1)
				classinstvars: #()
				classvars: #()
				category: packageName
				comment: ''
				pools: #()
				type: 'normal'.
			classDefinition gs_constraints: { { 'ivar1' . subclassName } }.
			methodSelector := user asLowercase, index asString.
			classDefinition
				addInstanceMethodDefinition:
					(RwMethodDefinition
						newForSelector: methodSelector asSymbol
						protocol: 'accessing'
						source: methodSelector, ' ^1').

			subclassDefinition := RwClassDefinition
				newForClassNamed: subclassName
				super: className
				instvars: #(ivar2)
				classinstvars: #()
				classvars: #()
				category: packageName
				comment: ''
				pools: #()
				type: 'normal'.
			subclassDefinition gs_constraints: { { 'ivar2' . 'Association' } }.

			packageDefinition := projectDefinition packageNamed: packageName.
			packageDefinition 
				addClassDefinition: classDefinition;
				addClassDefinition: subclassDefinition. 

			user ~= 'Dark'
				ifTrue: [
					"No external extension methods for Dark, since no write permissions"
					extensionPackageName := 'RowanSample5-', user, index printString, '-Extensions'.
					classExtensionDefinition := RwClassExtensionDefinition newForClassNamed: className.
					#('Red' 'Yellow' 'Blue' 'Dark')
						do: [:extensionUser |
							extensionUser ~= user
								ifTrue: [ 
									|  |
									methodSelector :=  'ext', extensionUser, index printString.
									classExtensionDefinition
										addInstanceMethodDefinition:
											(RwMethodDefinition
												newForSelector: methodSelector asSymbol
												protocol: '*', extensionPackageName asLowercase
												source: methodSelector, ' ^2') ] ].
					packageDefinition := projectDefinition packageNamed: extensionPackageName.
					packageDefinition addClassExtension: classExtensionDefinition ] ] ].
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
