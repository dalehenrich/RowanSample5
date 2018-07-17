
run
	| projectName stagingProjectDefinition projectTools packageNames loadedProject config diskProjectDefinition
		projectSetDefinitionToLoad projectDefinitionToLoad |
 
	projectName := 'Staging_RowanSample5'.
	packageNames := {}.
	RowanSample5_ApplicationSymbolDictionaries do: [:symDict |
		packageNames add: 'Staging-', symDict name asString ].
	packageNames add: 'Staging-Globals'.

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
	stagingProjectDefinition
			setSymbolDictName: 'Globals' forPackageNamed: 'Staging-Globals'.

	projectTools load loadProjectDefinition: stagingProjectDefinition.

	"Read RowanSample5 project from disk --- and force all packages to be loaded into Globals"
	diskProjectDefinition := Rowan projectTools create createProjectDefinitionFromSpecUrl: RowanSample5_Spec_Url.
	diskProjectDefinition packageNames do: [:packageName |
		diskProjectDefinition setSymbolDictName: 'Globals' forPackageNamed: packageName ].

	"Adopt symbol dicts into staging project"
	projectSetDefinitionToLoad := Rowan projectTools read readProjectSetForProjectDefinition: diskProjectDefinition.
	UserGlobals
		at: #RowanSample5_client_projectSetDefinitionToLoad
		put: projectSetDefinitionToLoad.

	"adopt Globals extension methods and all application symbol dictionaries"

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
			
	RowanSample5_ApplicationSymbolDictionaries do: [:dict |
		Rowan packageTools adopt
			adoptSymbolDictionary: dict
			intoPackageNamed: 'Staging-', dict name asString ].

	stagingProjectDefinition packages values do: [:pkgDefinition |
	    pkgDefinition classDefinitions values do: [:classDefinition |
	        pkgDefinition removeClassDefinition: classDefinition ].
	    pkgDefinition classExtensions values do: [:classExtension |
        	pkgDefinition removeClassExtension: classExtension ]].

	projectSetDefinitionToLoad
		addProject: stagingProjectDefinition.
%
commit

