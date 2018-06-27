
run
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
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
      System commit ] ].
%
commit

run
  (AllGroups includes: 'GlobalsModificationGroup')
    ifFalse: [AllGroups add: 'GlobalsModificationGroup' ].
  SystemObjectSecurityPolicy group: 'GlobalsModificationGroup' authorization: #write.
  (AllUsers userWithId: 'GlobalsCurator') addGroup: 'GlobalsModificationGroup'.
%
commit

run
  | userProfile |
  userProfile := AllUsers userWithId: 'ApplicationCurator'.
  (AllGroups includes: 'ApplicationModificationGroup')
    ifFalse: [AllGroups add: 'ApplicationModificationGroup' ].
  SystemRepository do: [:securityPolicy |
    userProfile userId ~= securityPolicy owner userId
      ifTrue: [ 
        (RowanSample5_allUserIds includes: securityPolicy owner userId)
          ifTrue: [ securityPolicy group: 'ApplicationModificationGroup' authorization: #write ] ] ].
  userProfile 
    addGroup: 'GlobalsModificationGroup';
    addGroup: 'ApplicationModificationGroup';
    yourself.
%
commit

run
  | devSymDicts privateSymDicts |
  devSymDicts := {}.
  privateSymDicts := {}.
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
    userCat ~= 'super' ifTrue: [
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
          "all users except 'GlobalsCurator', get the sharedSymbolDicts added to their list"
          symDicts := devSymDicts.
          userCat ~= 'dev' "assuming only one private user --- private users cannot share with other"
            ifTrue: [ 
              symDicts := devSymDicts copy.
              symDicts addAll: privateSymDicts ].
          userCat = 'super'
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

