import { gql } from '@apollo/client';

// // Define the GET_ME query
// interface MeData {
//     me: {
//         id: string; // assuming id is a string, change if necessary
//         name: string;
//         email: string;
//         // Add any other fields returned by your `me` query
//     };
// }

// interface MeVars {
//     // Add any variables required by your `me` query
// }

export const GET_ME = gql`
    query Me {
        me {
            id: string; // assuming id is a string, change if necessary
            name: string;
            email: string;

            # id
            # name
            # email
            
        }
    }
`;