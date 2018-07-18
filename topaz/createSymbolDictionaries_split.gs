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
   userCat ~= 'gemstone'
     ifTrue: [ 
       userIdList do: [:userId |
        | userProfile symbolList |
        "Needed to be able to use Jadeite ... in the short term"
        userProfile := AllUsers userWithId: userId.
        symbolList := userProfile symbolList.
        GsObjectSecurityPolicy 
          setCurrent: userProfile defaultObjectSecurityPolicy 
          while: [
            devSymDicts do: [:newDict |
              | size  |
              size := symbolList size.
              userProfile insertDictionary: newDict at: size + 1 ] ] ] ] ].
%
commit

