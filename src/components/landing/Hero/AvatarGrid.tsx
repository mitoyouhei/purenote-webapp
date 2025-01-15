import React from 'react';
import './AvatarGrid.css';

interface Avatar {
  id: number;
  src: string;
  alt: string;
  style: {
    top: string;
    left: string;
    animationDelay: string;
  };
}

const avatars: Avatar[] = [
  {
    id: 1,
    src: '/avatars/avatar1.svg',
    alt: 'User avatar',
    style: { top: '10%', left: '15%', animationDelay: '0s' }
  },
  {
    id: 2,
    src: '/avatars/avatar2.svg',
    alt: 'User avatar',
    style: { top: '20%', left: '75%', animationDelay: '0.5s' }
  },
  {
    id: 3,
    src: '/avatars/avatar3.svg',
    alt: 'User avatar',
    style: { top: '60%', left: '85%', animationDelay: '1s' }
  },
  {
    id: 4,
    src: '/avatars/avatar4.svg',
    alt: 'User avatar',
    style: { top: '70%', left: '25%', animationDelay: '1.5s' }
  },
  {
    id: 5,
    src: '/avatars/avatar5.svg',
    alt: 'User avatar',
    style: { top: '40%', left: '10%', animationDelay: '2s' }
  },
  {
    id: 6,
    src: '/avatars/avatar6.svg',
    alt: 'User avatar',
    style: { top: '30%', left: '90%', animationDelay: '2.5s' }
  }
];

export const AvatarGrid: React.FC = () => {
  return (
    <div className="avatar-grid">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          className="avatar"
          style={avatar.style}
        >
          <img src={avatar.src} alt={avatar.alt} />
        </div>
      ))}
    </div>
  );
};
