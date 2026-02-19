from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse


class APIRootTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)


class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {
            'name': 'Mona Octocat',
            'email': 'mona@octofit.example.com',
        }
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Mona Octocat')


class TeamAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {
            'name': 'Octo Runners',
            'description': 'A running team for Mona and friends.',
        }
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Octo Runners')


class ActivityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_activity(self):
        data = {
            'user_id': 'user_1',
            'activity_type': 'Running',
            'duration': 30,
            'calories': 300,
            'date': '2026-02-19T10:00:00Z',
        }
        response = self.client.post('/api/activities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['activity_type'], 'Running')


class LeaderboardAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_leaderboard_entry(self):
        data = {
            'user_id': 'user_1',
            'total_calories': 1500,
            'total_duration': 180,
            'total_activities': 6,
            'rank': 1,
        }
        response = self.client.post('/api/leaderboard/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rank'], 1)


class WorkoutAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        data = {
            'name': 'Morning HIIT',
            'description': 'High intensity interval training session.',
            'category': 'Cardio',
            'difficulty': 'Medium',
            'duration': 30,
            'calories_estimate': 350,
            'exercises': [],
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Morning HIIT')
