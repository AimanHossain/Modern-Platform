import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Code, Globe, Clock, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const values = [
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: 'Community First',
      description: 'We believe in the power of community and collaboration to create amazing experiences.'
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: 'Privacy & Security',
      description: 'Your data and content are protected with state-of-the-art security measures.'
    },
    {
      icon: <Code className="h-8 w-8 text-indigo-600" />,
      title: 'Open Innovation',
      description: 'We embrace open source principles and innovative technologies.'
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      title: 'Global Access',
      description: 'Building a platform that\'s accessible to everyone, everywhere.'
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: 'Long-term Vision',
      description: 'Creating sustainable solutions that stand the test of time.'
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
      title: 'High Performance',
      description: 'Delivering fast, responsive experiences across all devices.'
    }
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
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Modern Platform
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We're on a mission to create the most beautiful, functional platform for sharing and discovering content.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="prose prose-lg dark:prose-dark text-gray-600 dark:text-gray-300">
              <p>
                Founded in 2025, Modern Platform began with a simple idea: creating a space where people could share their creativity and ideas in a beautiful, user-friendly environment.
              </p>
              <p>
                What started as a small project has grown into a thriving community of creators, developers, designers, and innovators from around the world. We believe that everyone has something valuable to share, and we've built our platform to make that sharing as seamless and rewarding as possible.
              </p>
              <p>
                Today, we're proud to serve millions of users who use our platform to connect, learn, and inspire each other every day. Our team is dedicated to continuous improvement, always listening to our community and implementing features that enhance the user experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Values</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md"
                variants={itemVariants}
              >
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Team</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Meet the person behind Modern Platform
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="h-64 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <Users size={64} className="text-white" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Aiman
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-lg">
                  Founder & CEO
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Passionate about building innovative solutions and creating meaningful experiences that empower users worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join our community today and start sharing your content with the world.
          </p>
          {!user && (
            <div className="space-x-4">
              <Button 
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Sign up for free
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-indigo-700"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact us
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;