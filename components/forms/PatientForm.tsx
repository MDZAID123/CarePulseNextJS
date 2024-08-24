"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// we need to create a form schema for the form we will be using 
 import { Form } from "@/components/ui/form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { UserFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.action'

export enum FormFieldType{
  INPUT='input',
  CHECKBOX='checkbox',
  PHONE_INPUT='phone_input',
  DATE_PICKER = "DATE_PICKER",
  SKELETON = "SKELETON",
  SELECT = "SELECT",
  TEXTAREA = "TEXTAREA"
}
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
export function PatientForm() {
  // 1. Define your form.

  const router =useRouter();

  const [isLoading,setIsLoading]=useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name:"",
      email:"",
      phone:"",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("submitting the request for creating new user inside patient form \n")
    setIsLoading(true);

    try{
      const userData={
        name:values.name,
        email:values.email,
        phone:values.phone,

      };
      console.log(userData)

      const user=await createUser(userData);
     

      if(user) {
        console.log("user created now redirecting\n")
        router.push(`/patients/${user.$id}/register`)

      }else{
        console.log("error user cant be creater\n")
      }


    }catch(error){
      console.log(error);
    }
    console.log("hogya\n")
    setIsLoading(false);


  
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  flex-1">
      <section className='mb-12 space-y-4'>
        <h1 className='header'>Hi there </h1>
        <p className='text-dark-700'>Schedule your first appointment</p>


      </section>
      <CustomFormField
      fieldType={FormFieldType.INPUT}
      control={form.control}
      name="name"
      label="Full name"
      placeholder="John Doe"
      iconSrc="/assets/icons/user.svg"
      iconAlt="user"
      />
      <CustomFormField
      fieldType={FormFieldType.INPUT}
      control={form.control}
      name="email"
      label="Email"
      placeholder="johndoe@jsmastery.pro"
      iconSrc="/assets/icons/user.svg"
      iconAlt="email"
      />
      <CustomFormField
      fieldType={FormFieldType.PHONE_INPUT}
      control={form.control}
      name="phone"
      label="Phone number"
      placeholder="(555) 874-5355"
      
      />
    
     

      
      <SubmitButton
        isLoading={isLoading}>
            Get Started
      </SubmitButton>

    </form>
  </Form>
  )
}

export default PatientForm