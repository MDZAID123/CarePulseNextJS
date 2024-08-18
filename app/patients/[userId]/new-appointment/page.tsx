import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.action";



import Image from "next/image";
import Link from "next/link";
export default async  function NewAppointment({params: { userId }}:SearchParamProps) {
    const patient =await getPatient(userId);
    console.log( typeof userId)
    console.log("patient fetched inside of the appointment page\n")
    console.log(patient)

  return (
    <div className="flex h-screen max-he-screen">

     

      <section className=" remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">

          <Image
          src="/assets/icons/logo-full.svg"
          height={1000}
          width={1000}
          alt="patient"
          className="mb-12 h-10 w-fit"
          />

          {/* <PatientForm/> */}
          {/* here we will put appointment form  */}
          <AppointmentForm
          userId={userId}
          patientId={patient.$id} // change on this line made for testing
          type="create"
          />
            <p className="copyright mt-10 py-12">

          © 2024 Carepulse 
            </p>
           

       


        </div>

      </section>

      {/* here at the bottom we will have the appointment images */}
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"

      />
      
    </div>
  )
}