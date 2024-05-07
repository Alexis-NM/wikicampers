<?php

namespace App\Controller;

use App\Entity\Vehicle;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class VehicleController extends AbstractController
{
    /**
     * @Route("/api/vehicles", name="vehicle_create", methods={"POST"})
     */
    public function createVehicle(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $vehicle = new Vehicle();
        $vehicle->setMarque($data['marque']);
        $vehicle->setModele($data['modele']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($vehicle);
        $entityManager->flush();

        return $this->json($vehicle);
    }

    /**
     * @Route("/api/vehicles/{id}", name="vehicle_update", methods={"PUT"})
     */
    public function updateVehicle(Request $request, $id): Response
    {
        $vehicle = $this->getDoctrine()->getRepository(Vehicle::class)->find($id);
        $data = json_decode($request->getContent(), true);

        $vehicle->setMarque($data['marque']);
        $vehicle->setModele($data['modele']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return $this->json($vehicle);
    }

    /**
     * @Route("/api/vehicles/{id}", name="vehicle_delete", methods={"DELETE"})
     */
    public function deleteVehicle($id): Response
    {
        $vehicle = $this->getDoctrine()->getRepository(Vehicle::class)->find($id);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($vehicle);
        $entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/api/vehicles/{id}", name="vehicle_show", methods={"GET"})
     */
    public function getVehicle($id): Response
    {
        $vehicle = $this->getDoctrine()->getRepository(Vehicle::class)->find($id);

        return $this->json($vehicle);
    }
}
