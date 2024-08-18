"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// we need to create a form schema for the form we will be using 
 import { Form } from "@/components/ui/form"
import { z } from "zod"

import Image from "next/image";

import { Button } from "@/components/ui/button"
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import {  getAppointmentSchema } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.action'
import { FormFieldType } from './PatientForm'

import { Doctors } from '@/constants'
import { SelectItem } from '../ui/select'
import { createAppointment } from '@/lib/actions/appointment.actions'



type AppointmentType="create" |"cancel";

export function AppointmentForm({
  userId,
  patientId,
  type="create",
 
}:{
  userId:string,
  patientId:string,
  type:"create" |"schedule"|"cancel",
  
}) {
  // 1. Define your form.

  const router =useRouter();

  const [isLoading,setIsLoading]=useState(false);

  const AppointmentFormValidation=getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician:"",
      schedule:new Date(),
      reason:"",
      note:"",
      cancellationReason:"",
    },
  })

  let buttonLabel;
    switch (type){
      case 'cancel':
        buttonLabel='Cancel Appointment';
        break;

      case 'create':
        buttonLabel='Create Appointment';
        break;
      case 'schedule':
        buttonLabel='Schedule Appointment';
        break;


      default:
        break;
    }

 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    // basically we will be having 3 different appointment status 
    let status;
    switch (type){
      case 'schedule':
        status='scheduled';
        break;
      case 'cancel':
        status ='cancelled';
        break;
      default:
        status='pending';
        break;
    }


    try{
      if(type === 'create' && patientId){
        console.log("currently inside if statement of onsubmit \n")
        console.log(patientId)
        const appointmentData={
          userId,
          patient:patientId,
          primaryPhysician:values.primaryPhysician,
          schedule:new Date(values.schedule),
          reason:values.reason!,
          note:values.note,
          status:status as Status,
        }
        
        // now we will send this appointment data object to the backend
        console.log("here is the apppointment data object being sent to server action\n")
        console.log(appointmentData)
        const appointment=await createAppointment(appointmentData);
        console.log("successfully created appointment by using createappointment server action\n")
        console.log(appointment)

        if(appointment){
          // then in that case we will reset this form 
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);

        }
      }

      
     


    }catch(error){
      console.log(error);
    }
    setIsLoading(false);
  }

  


  
  

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  flex-1">
      <section className='mb-12 space-y-4'>
        <h1 className='header'>New Appointment </h1>
        <p className='text-dark-700'>Request a new Appointment in 10 seconds</p>


      </section>
      {/* using ternary operator to check if the type is not equal to cancel in that case we can render all custom fields */}

      {type !== "cancel" && (
        <>
        {/* first field in the appointmentform is the doctor select  */}
        <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Doctor"
        placeholder="Select a Doctor"
        >
            {Doctors.map((doctor,i)=>(
                <SelectItem key={doctor.name+i} value={doctor.name}>
                    <div className='flex cursor-pointer items-center gap-2'>
                        <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt="doctor"
                        className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>

                    </div>
                </SelectItem>
            ))}

        </CustomFormField>

        <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="schedule"
        label="Expected Appointment date"
        showTimeSelect
        dateFormat="MM/dd/yyyy h:mm aa">

        </CustomFormField>

        <div className='flex flex-col gap-6 xl:flex-row'>
          {/* inside of this div we will render 2 text area field according to the figma design
           */}
           <CustomFormField
           fieldType={FormFieldType.TEXTAREA}
           control={form.control}
           name="reason"
           label="Reason for appointment"
           placeholder="Enter reason for appointment"/>


           <CustomFormField
           fieldType={FormFieldType.TEXTAREA}
           control={form.control}
           name="note"
           label="Notes"
           placeholder='Enter Notes'/>

           



        </div>
        </>
      )}

      {/* now entering another dynamic code block based on conditional props passed to the component
       */}
       {type === "cancel" &&(
        <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="cancellationReason"
        label="Reason for cancellation"
        placeholder="Enter reason for cancellation"/>

       )}
     
     
    
     
       {/* our submit button will be rendereing a custom label based on condition met */}
      
   <SubmitButton isLoading={isLoading} className={`${type === 'cancel'  ? 'shad-danger-btn' :'shad-primary-btn'} w-full`}>
    {buttonLabel}

   </SubmitButton>

    </form>
  </Form>
  )
}

export default AppointmentForm