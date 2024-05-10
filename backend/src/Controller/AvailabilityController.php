<?php

namespace App\Controller;
use App\Entity\Availability;
use App\Entity\Vehicle;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class AvailabilityController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/availabilities", name="availability_index", methods={"GET"})
     */
    public function index(): Response
    {
        $availabilities = $this->entityManager->getRepository(Availability::class)->findAll();

        $availabilityArray = [];
        foreach ($availabilities as $availability) {
            $availabilityArray[] = [
                'id' => $availability->getId(),
                'dateDebut' => $availability->getDateDebut()->format('Y-m-d H:i:s'),
                'dateFin' => $availability->getDateFin()->format('Y-m-d H:i:s'),
                'prixParJour' => $availability->getPrixParJour(),
                'statut' => $availability->isStatut(),
                'vehicle' => [
                    'id' => $availability->getVehicle()->getId(),
                    'marque' => $availability->getVehicle()->getMarque(),
                    'modele' => $availability->getVehicle()->getModele()
                ]
            ];
        }

        return $this->json($availabilityArray);
    }

/**
* @Route("/api/availabilities", name="availability_create", methods={"POST"})
*/
public function createAvailability(Request $request): Response
{
   $data = json_decode($request->getContent(), true);

   $availability = new Availability();
   $availability->setDateDebut(new \DateTime($data['dateDebut']));
   $availability->setDateFin(new \DateTime($data['dateFin']));
   $availability->setPrixParJour($data['prixParJour']);
   $availability->setStatut($data['statut']);

   $vehicleId = $data['vehicle']['id'];
   $vehicle = $this->entityManager->getRepository(Vehicle::class)->find($vehicleId);
   $vehicleData = [
       'id' => $vehicle->getId(),
       'marque' => $vehicle->getMarque(),
       'modele' => $vehicle->getModele()
   ];
   $availability->setVehicle($vehicle);

   $this->entityManager->persist($availability);
   $this->entityManager->flush();

   $availabilityArray = [
       'id' => $availability->getId(),
       'dateDebut' => $availability->getDateDebut()->format('Y-m-d H:i:s'),
       'dateFin' => $availability->getDateFin()->format('Y-m-d H:i:s'),
       'prixParJour' => $availability->getPrixParJour(),
       'statut' => $availability->isStatut(),
       'vehicle' => $vehicleData
   ];

   return $this->json($availabilityArray);
}



/**
* @Route("/api/availabilities/{id}", name="availability_show", methods={"GET"})
*/
public function show($id): Response
{
   $availability = $this->entityManager->getRepository(Availability::class)->find($id);

   if (!$availability) {
       throw $this->createNotFoundException('L\'availability avec l\'ID ' . $id . ' n\'existe pas.');
   }

   $availabilityArray = [
       'id' => $availability->getId(),
       'dateDebut' => $availability->getDateDebut()->format('Y-m-d H:i:s'),
       'dateFin' => $availability->getDateFin()->format('Y-m-d H:i:s'),
       'prixParJour' => $availability->getPrixParJour(),
       'statut' => $availability->isStatut()
   ];

   $vehicle = $availability->getVehicle();
   $vehicleData = [
       'id' => $vehicle->getId(),
       'marque' => $vehicle->getMarque(),
       'modele' => $vehicle->getModele()
   ];

   $availabilityArray['vehicle'] = $vehicleData;

   return $this->json($availabilityArray);
}


    /**
     * @Route("/api/availabilities/{id}", name="availability_update", methods={"PUT"})
     */
    public function updateAvailability(Request $request, $id): Response
    {
        $availability = $this->entityManager->getRepository(Availability::class)->find($id);
        $data = json_decode($request->getContent(), true);

        if (!$availability) {
            throw $this->createNotFoundException('L\'availability avec l\'ID ' . $id . ' n\'existe pas.');
        }

        $availability->setDateDebut(new \DateTime($data['dateDebut']));
        $availability->setDateFin(new \DateTime($data['dateFin']));
        $availability->setPrixParJour($data['prixParJour']);
        $availability->setStatut($data['statut']);

        $this->entityManager->flush();

        $availabilityArray = [
            'id' => $availability->getId(),
            'dateDebut' => $availability->getDateDebut()->format('Y-m-d H:i:s'),
            'dateFin' => $availability->getDateFin()->format('Y-m-d H:i:s'),
            'prixParJour' => $availability->getPrixParJour(),
            'statut' => $availability->isStatut(),
            'vehicle' => [
                'id' => $availability->getVehicle()->getId(),
                'marque' => $availability->getVehicle()->getMarque(),
                'modele' => $availability->getVehicle()->getModele()
            ]
        ];

        return $this->json($availabilityArray);
    }

    /**
     * @Route("/api/availabilities/{id}", name="availability_delete", methods={"DELETE"})
     */
    public function deleteAvailability($id): Response
    {
        $availability = $this->entityManager->getRepository(Availability::class)->find($id);

        if (!$availability) {
            throw $this->createNotFoundException('L\'availability avec l\'ID ' . $id . ' n\'existe pas.');
        }

        $this->entityManager->remove($availability);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
