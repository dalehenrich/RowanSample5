
run
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
    usercat ~= 'gemstone' ifTrue: [
    userIdList do: [:userId |
      | newUser |
      newUser := AllUsers userWithId: userId ifAbsent: [ nil ].
      newUser
        ifNil: [
          | securityPolicy worldAuthorization |
          worldAuthorization := #read.
          userCat = 'private' ifTrue: [ worldAuthorization := #none ].
          securityPolicy := GsObjectSecurityPolicy new
	    ownerAuthorization: #write;
	    worldAuthorization: worldAuthorization;
	    yourself.
          System commit.
           newUser := AllUsers 
            addNewUserWithId: userId
            password: 'swordfish'
            defaultObjectSecurityPolicy: securityPolicy
            privileges: #('CodeModification'
              'UserPassword'
              'OtherPassword'
              'GarbageCollection'
              'SystemControl'
              'SessionAccess'
              'FileControl'
              'SessionPriority')
	    inGroups: #().
          securityPolicy owner: newUser ].
      System commit ] ] ].
%
commit

run
  (AllGroups includes: 'GlobalsModificationGroup')
    ifFalse: [AllGroups add: 'GlobalsModificationGroup' ].
  SystemObjectSecurityPolicy group: 'GlobalsModificationGroup' authorization: #write.

  (AllGroups includes: 'ApplicationModificationGroup')
    ifFalse: [AllGroups add: 'ApplicationModificationGroup' ].
  SystemRepository do: [:securityPolicy |
    (RowanSample5_devUserIds includes: securityPolicy owner userId)
      ifTrue: [ securityPolicy group: 'ApplicationModificationGroup' authorization: #write ] ].

  (AllUsers userWithId: RowanSample5_ApplicationCurator) 
    addGroup: 'GlobalsModificationGroup';
    addGroup: 'ApplicationModificationGroup';
    yourself.
  (AllUsers userWithId: RowanSample5_GlobalsCurator) addGroup: 'GlobalsModificationGroup'.
  (AllUsers userWithId: RowanSample5_UserCurator) addGroup: 'ApplicationModificationGroup'.
%
commit

run
  | devSymDicts privateSymDicts |
  devSymDicts := {}.
  privateSymDicts := {}.
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
	      #( 1 2 3 ) do: [:index |
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
          userCat ~= 'dev' "assuming only one private user --- private users cannot share with other"
            ifTrue: [ 
              symDicts := devSymDicts copy.
              symDicts addAll: privateSymDicts ].
          (userId = RowanSample5_ApplicationCurator or: [ userId = 'SystemUser' ])
            ifTrue: [ symDicts addAll: systemSymDicts ] ].
      GsObjectSecurityPolicy 
        setCurrent: userProfile defaultObjectSecurityPolicy 
        while: [
          symDicts do: [:newDict |
            | size  |
            size := symbolList size.
            userProfile insertDictionary: newDict at: size + 1 ] ] ] ].
%
commit

