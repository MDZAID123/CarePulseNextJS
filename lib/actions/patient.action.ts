"use server";
import { Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"

import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

import { InputFile } from "node-appwrite/file";
import { IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { parse } from "path";

export const createUser = async (user: CreateUserParams) => {

    try {

        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );
        console.log("user created from patient actions.ts file ")
        return parseStringify(newuser);


    } catch (error: any) {
        if (error && error?.code === 409) {

            const existingUser = await users.list([
                Query.equal('email', [user.email])
            ]);
            return existingUser.users[0];
        }
        console.log("An error occured while creating a new user:", error)
    }

}


export const getUser = async (userId: string) => {

    try {
        const user = await users.get(userId)
        return parseStringify(userId);

    } catch (error) {
        console.log(error)
    }
}

// registerpatient
//here we are working with appwrite storage

// Register Patient 
// export const registerPatient = async ({
//     identificationDocument,
//     ...patient
// }: RegisterUserParams) => {


//     try {
//         // here try to upload file 
//         let file;
//         if (identificationDocument) {
//             const inputFile = identificationDocument && InputFile.fromBuffer(
//                 identificationDocument?.get("blobFile") as Blob,
//                 identificationDocument?.get("fileName") as string

//             );
//             file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);

//         }
//         console.log("file uploaded to appwrite storage it will now be uploaded to patient document\n")
//         // adding console log to check if we are getting the correct gender field selected and passed forward as props
//         console.log({ gender: patient.gender })

//         // adding console log to check if we are getting correct identification document 

//         // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
//         const newPatient = await databases.createDocument(
//             DATABASE_ID!,
//             PATIENT_COLLECTION_ID!,
//             ID.unique(),
//             {
//                 identificationDocumentId: file?.$id ? file.$id : null,
//                 identificationDocumentUrl: file?.$id
//                     ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
//                     : null,
//                 ...patient,
//             }
//         );


//         console.log("doucment inserted into patient collection by taking things from appwrite storage\n")


//         return parseStringify(newPatient);
//     } catch (error) {
//         console.error("An error occured while creating a new  patient:", error);
//     }

// }



// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    console.log("file storeed in appwrite storage  now will be storing in appwrite collection\n")

    console.log(patient)
    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

     console.log("patient object inserted into patient collection \n")

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};



// get patient server action
export const getPatient=async(userId: string)=> {
    try{
        const patients=await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userid',userId)]
        );

        return parseStringify(patients.documents[0]);
    }catch(error){
        console.log(error)
    }
}