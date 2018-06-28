
run
  RowanSample5_userids
  keysAndValuesDo: [:userCat :userIdList |
    userCat ~= 'gemstone' ifTrue: [
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


