import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Globe, Shield, Code } from 'lucide-react';
import { Button } from '../components/ui/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: 'User Profiles',
      description: 'Create your personal profile and connect with others sharing similar interests.',
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      title: 'Content Sharing',
      description: 'Share your content with the world and discover amazing content from others.',
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: 'Secure Platform',
      description: 'Your data is secure with our state-of-the-art security and privacy features.',
    },
    {
      icon: <Code className="h-8 w-8 text-indigo-600" />,
      title: 'API Access',
      description: 'Access our API to build custom integrations with your favorite tools.',
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Your Modern Content Platform
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create, share, and discover amazing content in a beautiful, secure environment
            </motion.p>
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight size={16} />}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/explore')}
              >
                Explore Content
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Everything you need in one place
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Our platform provides all the tools you need to create, share, and manage your content.
            </p>
          </div>
          
          <motion.div 
            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Join thousands of users creating and sharing content on our platform.
            </p>
            <div className="mt-8">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={() => navigate('/register')}
              >
                Sign up for free
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;