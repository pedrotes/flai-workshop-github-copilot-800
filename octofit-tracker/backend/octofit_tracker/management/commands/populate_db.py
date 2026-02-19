from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Avengers assemble! The mightiest heroes on Earth.',
            created_at=datetime.now()
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League unite! Defenders of truth and justice.',
            created_at=datetime.now()
        )
        
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create Users - Marvel Heroes
        self.stdout.write('Creating Marvel heroes...')
        marvel_heroes = [
            {'name': 'Tony Stark', 'email': 'ironman@avengers.com'},
            {'name': 'Steve Rogers', 'email': 'captainamerica@avengers.com'},
            {'name': 'Thor Odinson', 'email': 'thor@asgard.com'},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@avengers.com'},
            {'name': 'Bruce Banner', 'email': 'hulk@avengers.com'},
            {'name': 'Peter Parker', 'email': 'spiderman@avengers.com'},
            {'name': 'Wanda Maximoff', 'email': 'scarletwitch@avengers.com'},
            {'name': 'TChalla', 'email': 'blackpanther@wakanda.com'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team_id=str(team_marvel._id),
                created_at=datetime.now()
            )
            marvel_users.append(user)
        
        # Create Users - DC Heroes
        self.stdout.write('Creating DC heroes...')
        dc_heroes = [
            {'name': 'Clark Kent', 'email': 'superman@justiceleague.com'},
            {'name': 'Bruce Wayne', 'email': 'batman@gotham.com'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@themyscira.com'},
            {'name': 'Barry Allen', 'email': 'flash@centralcity.com'},
            {'name': 'Arthur Curry', 'email': 'aquaman@atlantis.com'},
            {'name': 'Hal Jordan', 'email': 'greenlantern@oa.com'},
            {'name': 'Victor Stone', 'email': 'cyborg@justiceleague.com'},
            {'name': 'Oliver Queen', 'email': 'greenarrow@starcity.com'},
        ]
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team_id=str(team_dc._id),
                created_at=datetime.now()
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing', 'HIIT']
        activities_count = 0
        
        for user in all_users:
            # Create 5-10 random activities for each user
            num_activities = random.randint(5, 10)
            for _ in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)  # 20-120 minutes
                distance = random.uniform(2, 20) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = duration * random.randint(5, 12)  # Rough estimate
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories,
                    date=datetime.now() - timedelta(days=days_ago),
                    notes=f'{activity_type} session'
                )
                activities_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {activities_count} activities'))
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        for user in all_users:
            # Calculate totals from activities
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(a.calories for a in user_activities)
            total_duration = sum(a.duration for a in user_activities)
            total_activities = user_activities.count()
            
            Leaderboard.objects.create(
                user_id=str(user._id),
                team_id=user.team_id,
                total_calories=total_calories,
                total_duration=total_duration,
                total_activities=total_activities,
                rank=0  # Will be calculated later
            )
        
        # Update ranks based on total calories
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_calories')
        for rank, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = rank
            entry.save()
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} leaderboard entries'))
        
        # Create Workouts
        self.stdout.write('Creating workout suggestions...')
        workouts = [
            {
                'name': 'Super Soldier Training',
                'description': 'Captain America\'s legendary workout routine for building strength and endurance.',
                'category': 'Strength',
                'difficulty': 'Hard',
                'duration': 60,
                'calories_estimate': 500,
                'exercises': [
                    {'name': 'Push-ups', 'reps': 50},
                    {'name': 'Pull-ups', 'reps': 20},
                    {'name': 'Squats', 'reps': 100},
                    {'name': 'Plank', 'duration': '3 minutes'}
                ]
            },
            {
                'name': 'Asgardian Power Lift',
                'description': 'Thor\'s mighty strength training with heavy weights.',
                'category': 'Strength',
                'difficulty': 'Expert',
                'duration': 45,
                'calories_estimate': 450,
                'exercises': [
                    {'name': 'Deadlifts', 'sets': 5, 'reps': 5},
                    {'name': 'Bench Press', 'sets': 5, 'reps': 5},
                    {'name': 'Overhead Press', 'sets': 5, 'reps': 5}
                ]
            },
            {
                'name': 'Speed Force Sprint',
                'description': 'Flash\'s high-intensity interval training for maximum speed.',
                'category': 'Cardio',
                'difficulty': 'Medium',
                'duration': 30,
                'calories_estimate': 400,
                'exercises': [
                    {'name': 'Sprint intervals', 'duration': '30 seconds on, 30 seconds off', 'rounds': 10},
                    {'name': 'High knees', 'duration': '1 minute'},
                    {'name': 'Burpees', 'reps': 20}
                ]
            },
            {
                'name': 'Web-Slinger Agility',
                'description': 'Spider-Man\'s acrobatic workout for flexibility and agility.',
                'category': 'Flexibility',
                'difficulty': 'Medium',
                'duration': 40,
                'calories_estimate': 300,
                'exercises': [
                    {'name': 'Dynamic stretching', 'duration': '10 minutes'},
                    {'name': 'Jump rope', 'duration': '5 minutes'},
                    {'name': 'Box jumps', 'reps': 20},
                    {'name': 'Leg swings', 'reps': 30}
                ]
            },
            {
                'name': 'Dark Knight Combat',
                'description': 'Batman\'s martial arts and combat training routine.',
                'category': 'Combat',
                'difficulty': 'Hard',
                'duration': 55,
                'calories_estimate': 520,
                'exercises': [
                    {'name': 'Shadow boxing', 'rounds': 5, 'duration': '3 minutes per round'},
                    {'name': 'Kicks practice', 'reps': 50},
                    {'name': 'Core workout', 'duration': '10 minutes'}
                ]
            },
            {
                'name': 'Kryptonian Cardio',
                'description': 'Superman\'s high-altitude endurance training.',
                'category': 'Cardio',
                'difficulty': 'Hard',
                'duration': 50,
                'calories_estimate': 600,
                'exercises': [
                    {'name': 'Running', 'duration': '30 minutes'},
                    {'name': 'Jump squats', 'reps': 50},
                    {'name': 'Mountain climbers', 'reps': 100}
                ]
            },
            {
                'name': 'Warrior Princess Flow',
                'description': 'Wonder Woman\'s balanced workout combining strength and grace.',
                'category': 'Mixed',
                'difficulty': 'Medium',
                'duration': 45,
                'calories_estimate': 420,
                'exercises': [
                    {'name': 'Yoga flow', 'duration': '15 minutes'},
                    {'name': 'Resistance band work', 'duration': '15 minutes'},
                    {'name': 'Balance exercises', 'duration': '15 minutes'}
                ]
            },
            {
                'name': 'Zen Master Recovery',
                'description': 'Doctor Strange\'s meditation and recovery routine.',
                'category': 'Recovery',
                'difficulty': 'Easy',
                'duration': 30,
                'calories_estimate': 150,
                'exercises': [
                    {'name': 'Meditation', 'duration': '15 minutes'},
                    {'name': 'Gentle stretching', 'duration': '10 minutes'},
                    {'name': 'Breathing exercises', 'duration': '5 minutes'}
                ]
            }
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout suggestions'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('=====================================\n'))
