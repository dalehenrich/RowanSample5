
run
	| projectName projectDefinition projectTools packageNames loadedProject config |
 
	projectName := 'Staging_RowanSample5'.
	packageNames := {}.
	RowanSample5_ApplicationSymbolDictionaries do: [:symDict |
		packageNames add: 'Staging-', symDict name asString ].

	projectTools := Rowan projectTools.

	"Create the project definition - in memory only ... disk image not created, nor needed"
	projectDefinition := Rowan projectTools create
		createDiskBasedProjectDefinition: projectName 
		packageNames: packageNames 
		format: 'tonel'
		root: '$ROWAN_PROJECTS_HOME'.
	RowanSample5_ApplicationSymbolDictionaries do: [:symDict |
		projectDefinition
			setSymbolDictName: symDict name asString forPackageNamed: 'Staging-', symDict name asString ].
	projectTools load loadProjectDefinition: projectDefinition.
%
commit

run
	RowanSample5_ApplicationSymbolDictionaries do: [:symDict |
		Rowan packageTools adopt 
			adoptSymbolDictionary: symDict intoPackageNamed: 'Staging-', symDict name asString ].
	Rowan packageTools adopt
        	adoptSymbolDictionary: Globals intoPackageNamed: 'Staging-Globals'.
%
commit
