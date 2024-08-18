"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// we need to create a form schema for the form we will be using 
import { Form, FormControl, FormField } from "@/components/ui/form"
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { PatientFormValidation, UserFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser, registerPatient } from '@/lib/actions/patient.action'
import { FormFieldType } from './PatientForm'
// import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants'
import { Label } from '@radix-ui/react-label'
import { SelectItem } from '../ui/select'
import FileUploader from '../FileUploader'


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})
export function RegisterForm({ user }: { user: User }) {
    // 1. Define your form.

    const router = useRouter();

    console.log("user received from page.tsx as props in registration form .tsx\n")
    console.log(user)

    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true);


        let formData;

        if(values.identificationDocument && values.identificationDocument.length>0){

            const blobFile=new Blob([values.identificationDocument[0]],{
                type:values.identificationDocument[0].type,
            });


            formData=new FormData();
            formData.append('blobFile',blobFile);
            formData.append('fileName',values.identificationDocument[0].name)


        }

        try {
        //   const patientData={

        //     ...values,
        //     userId:user.$id,
        //     birthDate:new Date(values.birthDate),
        //     identificationDocument:formData,


        //   }

        console.log("user details on patient form \n")
        console.log(user)
        console.log("\n")
        const patient = {
            userid: user,
            name: values.name,
            email: values.email,
            phone: values.phone,
            birthDate: new Date(values.birthDate),
            gender: values.gender,
            address: values.address,
            occupation: values.occupation,
            emergencyContactName: values.emergencyContactName,
            emergencyContactNumber: values.emergencyContactNumber,
            primaryPhysician: values.primaryPhysician,
            insuranceProvider: values.insuranceProvider,
            insurancePolicyNumber: values.insurancePolicyNumber,
            allergies: values.allergies,
            currentMedication: values.currentMedication,
            familyMedicalHistory: values.familyMedicalHistory,
            pastMedicalHistory: values.pastMedicalHistory,
            identificationType: values.identificationType,
            identificationNumber: values.identificationNumber,
            identificationDocument: values.identificationDocument
              ? formData
              : undefined,
            privacyConsent: values.privacyConsent,
            treatmentConsent:values.treatmentConsent,
            disclosureConsent:values.treatmentConsent
          };
    
        //   once we have patient data
        //moving from home page to registration to new appointment 

        const newPatient=await registerPatient(patient);

        console.log("new patient created now we are again this is from \n registerform component \n")


        if (newPatient){
            console.log("checking type of user \n")
            console.log(typeof user);

         router.push(`/patients/${user}/new-appointment`);
        }

            


           


        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);



    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12  flex-1">
                <section className=' space-y-4'>
                    <h1 className='header'>Welcome</h1>
                    <p className='text-dark-700'>Let us know more about yourself</p>


                </section>
                <section className=' space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Personal Information</h2>

                    </div>




                </section>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                {/* other  */}
                <div className='flex flex-col gap-6 xl:flex-row'>

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
                </div>


                {/* putting different section of the form in different div */}
                {/* we will duplicate the below div in the the grp of 2 because  we hve a 2 column grid */}
                <div className='flex flex-col gap-6 xl:flex-row'>
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"

                    />
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className='flex h-11 gap-6 xl:justify-between'
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {/* finally here we can choose from a diff range of options */}
                                    {GenderOptions.map((option, i) => (
                                        <div key={option + i}
                                            className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>

                                        </div>

                                    ))}

                                </RadioGroup>

                            </FormControl>
                        )}

                    />

                </div>



                <div className='flex flex-col gap-6 xl:flex-row'>
                    {/* getting the address of the user */}

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="14th Street New York"

                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="occupation"
                        label="occupation"
                        placeholder="Software Engineer"

                    />

                </div>




                <div className='flex flex-col gap-6 xl:flex-row'>
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency contact name"
                        placeholder="Guardian's name"

                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency contact number"
                        placeholder="(555) 123-4567"

                    />

                </div>


                {/* medical information section of the registration */}
                <section className=' space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Medical Information</h2>

                    </div>





                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="primary Physician"
                        placeholder="Select a Physician"

                    >
                        {Doctors.map((doctor, i) => (
                            <SelectItem key={doctor.name + i} value={doctor.name}>
                                <div className="flex cursor-pointer items.center gap-2">
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




                    {/* Insurance and Policy Number  */}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insuranceProvider"
                            label="Insurance provider"
                            placeholder="BlueCross BlueShield"
                        />


                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insurancePolicyNumber"
                            label="Insurance policy number"
                            placeholder="ABC123556"
                        />



                    </div>

                    {/* allergies */}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="allergies"
                            label="Allergies (if any)"
                            placeholder="Peanuts ,penicillin,pollen"
                        />


                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="currentMedication"
                            label="Current medication (if any)"
                            placeholder="Ibuprofen 200mg ,Paracetamol 500mg"
                        />



                    </div>
                    {/* Family medical history */}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="familyMedicalHistory"
                            label="Family medical history"
                            placeholder="Mother had brain cancer ,Father had heart disease"
                        />


                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="pastMedicalHistory"
                            label="Past Medical History"
                            placeholder="Appendectomy Tonsillectomy"
                        />



                    </div>
                </section>
                {/* another section  */}
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>
                            Identification and verification

                        </h2>

                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="identificationType"
                        label="Identification type"
                        placeholder="Select an identification type"

                    >
                        {IdentificationTypes.map((type,i) => (
                            <SelectItem key={type+i} value={type}>
                                {type}


                            </SelectItem>
                        ))}

                    </CustomFormField>


                    <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="identificationNumber"
                            label="Identification number"
                            placeholder="123456789"
                        />
                         <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="identificationDocument"
                        label="Scanned Copy of identification document"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                                />
                            </FormControl>
                            
                        )}  

                    />


                </section>

                <div className='flex flex-col gap-6 xl:flex-row'>

                </div>

                {/* another section for consent and privacy  */}
                {/* in this section we can render some custom form field */}
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>
                            Consent and Privacy

                        </h2>

                    </div>




                </section>


                <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="treatmentConsent"
                label="I consent to treatmenet"
                
                
                
                />



                <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                label="I consent to disclosure of information"
                />

                <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                label="I acknowledge that I have reviewed and agree to the privacy policy"
                />









                <SubmitButton
                    isLoading={isLoading}>
                    Submit and Continue
                </SubmitButton>

            </form>
        </Form>
    )
}

export default RegisterForm 