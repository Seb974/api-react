<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\BookingRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *      normalizationContext={
 *          "groups"={"bookings_read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      },
 * )
 * @ORM\Entity(repositoryClass=BookingRepository::class)
 */
class Booking
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"bookings_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=60)
     * @Groups({"bookings_read"})
     * @Assert\NotBlank(message="L'adresse email est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit être valide")
     */
    private $email;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"bookings_read"})
     * @Assert\NotNull(message="Les dates de réservation sont obligatoires")
     * @Assert\Type(type = "\DateTime", message="Les dates entrées ne sont pas au bon format")
     * @Assert\Length(min = 1, minMessage = "Les dates de réservation sont obligatoires", allowEmptyString = false)
     */
    private $checkIn;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"bookings_read"})
     * @Assert\NotNull(message="Les dates de réservation sont obligatoires")
     * @Assert\Type(type = "\DateTime", message="Les dates entrées ne sont pas au bon format")
     * @Assert\Length(min = 1, minMessage = "Les dates de réservation sont obligatoires", allowEmptyString = false)
     */
    private $checkOut;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCheckIn(): ?\DateTimeInterface
    {
        return $this->checkIn;
    }

    public function setCheckIn($checkIn): self          // \DateTimeInterface
    {
        $this->checkIn = $checkIn;

        return $this;
    }

    public function getCheckOut(): ?\DateTimeInterface
    {
        return $this->checkOut;
    }

    public function setCheckOut($checkOut): self        // \DateTimeInterface
    {
        $this->checkOut = $checkOut;

        return $this;
    }
}
