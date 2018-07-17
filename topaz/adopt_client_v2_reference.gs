
run
	| projectName stagingProjectDefinition projectTools packageNames loadedProject config diskProjectDefinition
		projectSetDefinitionToLoad |
 
	projectName := 'Staging_RowanSample5'.
	packageNames := {}.
	RowanSample5_ApplicationSymbolDictionaries do: [:symDict |
		packageNames add: 'Staging-', symDict name asString ].

	projectTools := Rowan projectTools.

	"Create the staging project definition - in memory only ... disk image not created, nor needed"
	stagingProjectDefinition := Rowan projectTools create
		createDiskBasedProjectDefinition: projectName 
		packageNames: packageNames 
		format: 'tonel'
		root: '$ROWAN_PROJECTS_HOME'.
	RowanSample5_ApplicationSymbolDictionaries do: [:symDict |
		stagingProjectDefinition
			setSymbolDictName: symDict name asString forPackageNamed: 'Staging-', symDict name asString ].
	projectTools load loadProjectDefinition: stagingProjectDefinition.

	"Adopt symbol dicts into staging project"
	diskProjectDefinition := Rowan projectTools create createProjectDefinitionFromSpecUrl: RowanSample5_Spec_Url.
	projectSetDefinitionToLoad := Rowan projectTools read readProjectSetForProjectDefinition: diskProjectDefinition.
	UserGlobals
		at: #RowanSample5_client_projectSetDefinitionToLoad
		put: projectSetDefinitionToLoad.

false ifTrue: [
	projectDefinitionToLoad := projectSetDefinitionToLoad projectNamed: 'RowanSample5'.
	projectDefinitionToLoad
		packages values do: [:packageDefinition |
			packageDefinition classExtensions values do: [:classExtension |
				(Globals at: classExtension name asSymbol ifAbsent: []) ifNotNil: [
					classExtension instanceMethodDefinitions valuesDo: [:methodDefinition |
						Rowan packageTools 
							adoptMethod: methodDefinition selector inClassNamed: classExtension name isMeta: false intoPackageNamed: 'Staging-Globals' ].
					classExtension classMethodDefinitions valuesDo: [[:methodDefinition |
						Rowan packageTools 
							adoptMethod: methodDefinition selector inClassNamed: classExtension name isMeta: true intoPackageNamed: 'Staging-Globals']]]]].
] ifFalse: [
	"adopt Globals and all application symbol dictionaries"
	Rowan packageTools adopt
        	adoptSymbolDictionary: Globals intoPackageNamed: 'Staging-Globals'.
	RowanSample5_ApplicationSymbolDictionaries do: [:dict |
		Rowan packageTools adopt
			adoptSymbolDictionary: dict
			intoPackageNamed: 'Staging-', dict name asString ]
].

false ifTrue: [
	"remove the class defintions and class extension definitions from the staging project definition"
	stagingProjectDefinition packages values do: [:pkgDefinition |
   		pkgDefinition classDefinitions values copy do: [:classDefinition |
       			pkgDefinition removeClassDefinition: classDefinition ].
    		pkgDefinition classExtensions values copy do: [:classExtension |
        		pkgDefinition removeClassExtension: classExtension ]].
].
%
commit
