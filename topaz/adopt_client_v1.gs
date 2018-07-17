
run
	| projectName stagingProjectDefinition projectTools packageNames loadedProject config diskProjectDefinition
		projectSetDefinitionToLoad |
 
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

	"adopt Globals and all application symbol dictionaries"
	Rowan packageTools adopt
        	adoptSymbolDictionary: Globals intoPackageNamed: 'Staging-Globals'.
	RowanSample5_ApplicationSymbolDictionaries do: [:dict |
		Rowan packageTools adopt
			adoptSymbolDictionary: dict
			intoPackageNamed: 'Staging-', dict name asString ]
%
commit
