<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Vehicle;

class VehicleController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/vehicles", name="vehicle_index", methods={"GET"})
     */
    public function getAllVehicles(): Response
    {
        $vehicles = $this->entityManager->getRepository(Vehicle::class)->findAll();

        // Création d'un tableau pour stocker les données formatées
        $formattedVehicles = [];
        foreach ($vehicles as $vehicle) {
            $formattedVehicles[] = [
                'id' => $vehicle->getId(),
                'marque' => $vehicle->getMarque(),
                'modele' => $vehicle->getModele(),
            ];
        }

        return $this->json($formattedVehicles);
    }

    /**
     * @Route("/api/vehicles", name="vehicle_create", methods={"POST"})
     */
    public function createVehicle(Request $request): Response
    {
        // Récupérer les données du corps de la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier si les données attendues sont présentes
        if (!isset($data['marque']) || !isset($data['modele'])) {
            // Retourner une réponse avec un code d'erreur et un message explicatif
            return new JsonResponse(['message' => 'Marque et modèle sont requis'], Response::HTTP_BAD_REQUEST);
        }

        // Créer un nouveau véhicule avec les données reçues
        $vehicle = new Vehicle();
        $vehicle->setMarque($data['marque']);
        $vehicle->setModele($data['modele']);

        // Enregistrer le nouveau véhicule dans la base de données
        $this->entityManager->persist($vehicle);
        $this->entityManager->flush();

        // Retourner une réponse avec le nouveau véhicule créé
        return $this->json([
            'id' => $vehicle->getId(),
            'marque' => $vehicle->getMarque(),
            'modele' => $vehicle->getModele(),
        ], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/vehicles/{id}", name="vehicle_update", methods={"PUT"})
     */
    public function updateVehicle(Request $request, $id): Response
    {
        $vehicle = $this->entityManager->getRepository(Vehicle::class)->find($id);

        // Vérifier si le véhicule existe
        if (!$vehicle) {
            // Retourner une réponse avec un code d'erreur et un message explicatif
            return new JsonResponse(['message' => 'Véhicule non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer les données du corps de la requête
        $data = json_decode($request->getContent(), true);

        // Mettre à jour les données du véhicule
        if (isset($data['marque'])) {
            $vehicle->setMarque($data['marque']);
        }
        if (isset($data['modele'])) {
            $vehicle->setModele($data['modele']);
        }

        // Enregistrer les modifications dans la base de données
        $this->entityManager->flush();

        // Retourner une réponse avec le véhicule mis à jour
        return $this->json([
            'id' => $vehicle->getId(),
            'marque' => $vehicle->getMarque(),
            'modele' => $vehicle->getModele(),
        ]);
    }

    /**
     * @Route("/api/vehicles/{id}", name="vehicle_delete", methods={"DELETE"})
     */
    public function deleteVehicle($id): Response
    {
        $vehicle = $this->entityManager->getRepository(Vehicle::class)->find($id);

        // Vérifier si le véhicule existe
        if (!$vehicle) {
            // Retourner une réponse avec un code d'erreur et un message explicatif
            return new JsonResponse(['message' => 'Véhicule non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer le véhicule de la base de données
        $this->entityManager->remove($vehicle);
        $this->entityManager->flush();

        // Retourner une réponse avec un message de succès
        return new JsonResponse(['message' => 'Véhicule supprimé'], Response::HTTP_OK);
    }

    /**
     * @Route("/api/vehicles/{id}", name="vehicle_show", methods={"GET"})
     */
    public function getVehicle($id): Response
    {
        $vehicle = $this->entityManager->getRepository(Vehicle::class)->find($id);

        // Vérifier si le véhicule existe
        if (!$vehicle) {
            // Retourner une réponse avec un code d'erreur et un message explicatif
            return new JsonResponse(['message' => 'Véhicule non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Retourner une réponse avec le véhicule
        return $this->json([
            'id' => $vehicle->getId(),
            'marque' => $vehicle->getMarque(),
            'modele' => $vehicle->getModele(),
        ]);
    }
}
