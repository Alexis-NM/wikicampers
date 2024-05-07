<?php

namespace App\Controller;

use App\Entity\Availability;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AvailabilityController extends AbstractController
{
    /**
     * @Route("/api/availabilities", name="availability_index", methods={"GET"})
     */
    public function index(): Response
    {
        $availabilities = $this->getDoctrine()->getRepository(Availability::class)->findAll();

        return $this->json($availabilities);
    }

    /**
     * @Route("/api/availabilities/{id}", name="availability_show", methods={"GET"})
     */
    public function show($id): Response
    {
        $availability = $this->getDoctrine()->getRepository(Availability::class)->find($id);

        return $this->json($availability);
    }

    /**
     * @Route("/api/availabilities", name="availability_create", methods={"POST"})
     */
    public function createAvailability(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $availability = new Availability();
        $availability->setStartDate(new \DateTime($data['startDate']));
        $availability->setEndDate(new \DateTime($data['endDate']));
        $availability->setPricePerDay($data['pricePerDay']);
        $availability->setStatus($data['status']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($availability);
        $entityManager->flush();

        return $this->json($availability);
    }

    /**
     * @Route("/api/availabilities/{id}", name="availability_update", methods={"PUT"})
     */
    public function updateAvailability(Request $request, $id): Response
    {
        $availability = $this->getDoctrine()->getRepository(Availability::class)->find($id);
        $data = json_decode($request->getContent(), true);

        $availability->setStartDate(new \DateTime($data['startDate']));
        $availability->setEndDate(new \DateTime($data['endDate']));
        $availability->setPricePerDay($data['pricePerDay']);
        $availability->setStatus($data['status']);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return $this->json($availability);
    }

    /**
     * @Route("/api/availabilities/{id}", name="availability_delete", methods={"DELETE"})
     */
    public function deleteAvailability($id): Response
    {
        $availability = $this->getDoctrine()->getRepository(Availability::class)->find($id);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($availability);
        $entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
