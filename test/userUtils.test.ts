import { getAddedByOrID, getRole } from '../src/utils/userUtils'

describe('UserUtils', () => {

     const tokens  = ['1234abcd,0,123abc','1234abcd,1,123abc','1234abcd,2,123abc'];
    describe('getAddedByOrID', () => {

    tokens.forEach(token => {
            it(`will return the user ID or the ID depending on the role 1234abcd`, () => {
             const id = getAddedByOrID(token)
             const role = token.split(',')[1];
             const expected = role != '2' ? token.split(',')[0] : token.split(',')[2]
             expect(id).toEqual(expected);
        })
        });
    })

     describe('getRole', () => {
      tokens.forEach(token=>{
        const getUserID = getRole(token);
         const expected = token.split(',')[1];
        it('will return the Role 0', () => {
            expect(getUserID).toEqual(expected);
        })
      })
    })

})
