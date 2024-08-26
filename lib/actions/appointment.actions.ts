'use server'


// here in this file we will creating all of our required server actions for appointments

import { ID, Query } from "node-appwrite";
import { DATABASE_ID, databases, APPOINTMENT_COLLECTION_ID, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { parse } from "path";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";



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


//getrecentappointmentlist 

export const getRecentAppointmentList=async ()=> {
    try{
        const appointments=await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]

        );

        const initialCounts={ 
            scheduledCount:0,
            pendingCount:0,
            cancelledCount:0,
        }

        const counts=(appointments.documents as Appointment[]).reduce((acc,appointment)=>{
            switch (appointment.status){
                case "scheduled":
                    acc.scheduledCount++;
                    break;
                case "pending":
                    acc.pendingCount++;
                    break;

                case "cancelled":
                    acc.cancelledCount++;
                    break;
            }
            return acc ;
        },initialCounts);

        // once we have all the value we can format that in an object 
        const data={
            totalCount:appointments.total,
            ...counts,
            documents:appointments.documents,
        }

        return parseStringify(data);


    }catch(error){
        console.log("An error occured while retrivring the recent appointments:",error)
    }
}



// update appointment server action

export const updateAppointment=async({appointmentId,userId,appointment,type}:UpdateAppointmentParams)=>{

    try{
        // if wverything goes right we want to update the appointment to schedule
        const updatedAppointment=await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updateAppointment){
            throw new Error('Appointment not found');
        }
        //else we want to send an sms notification if the appointmnet was successfully booked
        //todo sms notifcation after success
        const smsMessage=`
        Hi it is CarePulse.
        ${type === 'schedule'? `Your appointment has been scheduled for  ${formatDateTime(appointment.schedule!).dateTime} with Dr . ${appointment.primaryPhysician}`:
            `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
        }
        `

        await sendSMSNotification(userId,smsMessage);
        //now we will be revalidate the path 
        revalidatePath('/admin');
        return parseStringify(updateAppointment)


    }catch(error){
        console.log(error);
    }
}


// adding server action for sms notification
export const sendSMSNotification=async(userId:string,content:string)=>{
    try{

        const message=await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )
        // once we have the message we can simply return it to the frontend
        return parseStringify(message);
         
        
    }catch(error){
        console.log(error);

    }
}