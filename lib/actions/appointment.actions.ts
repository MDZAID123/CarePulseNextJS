'use server'


// here in this file we will creating all of our required server actions for appointments

import { ID } from "node-appwrite";
import { DATABASE_ID, databases, APPOINTMENT_COLLECTION_ID } from "../appwrite.config";
import { parseStringify } from "../utils";
import { parse } from "path";



// we will be getting access to the patient data in these server action props

export const createAppointment=async (appointment: CreateAppointmentParams) =>{

    try{

        const newAppointment=await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
           
        )

        return parseStringify(newAppointment);

        
    } catch(error){
        console.log(error);
    }
}


export const getAppointment=async (appointmentId: string) =>{

    try{
        const appointment=await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment);

    }catch (error){
        console.log(error);

    }


}