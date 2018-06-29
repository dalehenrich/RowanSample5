run
  | devSymDicts privateSymDicts systemSymDicts |
  devSymDicts := {}.
  privateSymDicts := {}.
  systemSymDicts := { RowanKernel. RowanLoader. RowanTools }.
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
    (#('super' 'system') includes: userCat) ifFalse: [
    "super users do not have their own symbol dictionaries"
    userIdList
    do: [:userId |
      | userProfile symbolList |
      userProfile := AllUsers userWithId: userId.
      symbolList := userProfile symbolList.
      GsObjectSecurityPolicy 
	  setCurrent: userProfile defaultObjectSecurityPolicy 
	    while: [
	      #( 1 2" 3" ) do: [:index |
              | newDict session |
              newDict := SymbolDictionary new
                  name: (userId, index printString) asSymbol;
                  objectSecurityPolicy: userProfile defaultObjectSecurityPolicy;
                  yourself.
              userCat = 'dev'
                ifTrue: [ devSymDicts add: newDict ].
              userCat = 'private'
                ifTrue: [ privateSymDicts add: newDict ] ] ] ] ] ].

  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
   userIdList do: [:userId |
      | userProfile symbolList symDicts |
      "Needed to be able to use Jadeite ... in the short term"
      userProfile := AllUsers userWithId: userId.
      (userProfile objectNamed: 'UserGlobals')
        at: #rowanCompile put: true.
      symbolList := userProfile symbolList.
      userId = RowanSample5_GlobalsCurator
        ifTrue: [ symDicts := systemSymDicts ]
        ifFalse: [  
          "all users except RowanSample5_GlobalsCurator, get the sharedSymbolDicts added to their list"
          symDicts := devSymDicts.
          userCat ~= 'dev' "assuming only one private user --- private users cannot share with other"
            ifTrue: [ 
              symDicts := devSymDicts copy.
              symDicts addAll: privateSymDicts ].
          userId = RowanSample5_ApplicationCurator
            ifTrue: [ symDicts addAll: systemSymDicts ] ].
      GsObjectSecurityPolicy 
        setCurrent: userProfile defaultObjectSecurityPolicy 
        while: [
          symDicts do: [:newDict |
            | size  |
            size := symbolList size.
            userProfile insertDictionary: newDict at: size + 1 ] ] ] ].
      devSymDicts 
        addAll: privateSymDicts;
        addAll: {Globals}.
      UserGlobals
        at: #'RowanSample5_ApplicationSymbolDictionaries'
        put: devSymDicts.
%
commit

