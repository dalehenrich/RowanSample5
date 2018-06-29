run
  | devSymDicts userId userProfile symbolList |

  devSymDicts := {}.
  userId := RowanSample5_ApplicationCurator.
  userProfile := AllUsers userWithId: userId.
  symbolList := userProfile symbolList.
  GsObjectSecurityPolicy 
    setCurrent: userProfile defaultObjectSecurityPolicy 
    while: [
      | newDict session |
      newDict := SymbolDictionary new
        name: #Application;
        objectSecurityPolicy: userProfile defaultObjectSecurityPolicy;
        yourself.
     devSymDicts add: newDict ].

  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
   userIdList do: [:userId |
      | userProfile symbolList symDicts systemSymDicts |
      "Needed to be able to use Jadeite ... in the short term"
      userProfile := AllUsers userWithId: userId.
      (userProfile objectNamed: 'UserGlobals')
        at: #rowanCompile put: true.
      symbolList := userProfile symbolList.
      systemSymDicts := { RowanKernel. RowanLoader. RowanTools }.
      userId = RowanSample5_GlobalsCurator
        ifTrue: [ symDicts := systemSymDicts ]
        ifFalse: [  
          "all users except RowanSample5_GlobalsCurator, get the sharedSymbolDicts added to their list"
          symDicts := devSymDicts.
          userId = RowanSample5_ApplicationCurator
            ifTrue: [
		symDicts := symDicts copy. 
		symDicts addAll: systemSymDicts ] ].
      GsObjectSecurityPolicy 
        setCurrent: userProfile defaultObjectSecurityPolicy 
        while: [
          symDicts do: [:newDict |
            | size  |
            size := symbolList size.
            userProfile insertDictionary: newDict at: size + 1 ] ] ] ].
%
commit

